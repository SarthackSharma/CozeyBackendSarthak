import { GeneratePackingList } from '../GeneratePackingList';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Order, LineItem } from '../../../domain/entities/Order';
import { Product, Component } from '../../../domain/entities/Product';

describe('GeneratePackingList', () => {
  const mockOrder: Order = {
    order_id: '1',
    order_total: 100,
    order_date: '2024-02-14',
    shipping_address: '123 Test St',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    line_items: [
      {
        line_item_id: '1',
        product_id: 'P1',
        product_name: 'Test Product',
        price: 100,
        quantity: 1
      }
    ]
  };

  const mockProduct: Product = {
    product_id: 'P1',
    product_name: 'Test Product',
    product_type: 'Test Type',
    components: [
      {
        component_id: 'C1',
        name: 'Test Component',
        quantity: 2,
        location: 'A1'
      }
    ]
  };

  const mockOrderRepository: jest.Mocked<IOrderRepository> = {
    getOrdersByDate: jest.fn(),
    saveOrder: jest.fn(),
    getOrderById: jest.fn(),
    updateOrder: jest.fn()
  };

  const mockProductRepository: jest.Mocked<IProductRepository> = {
    getAllProducts: jest.fn(),
    getProductById: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate packing list for given date', async () => {
    mockOrderRepository.getOrdersByDate.mockResolvedValue([mockOrder]);
    mockProductRepository.getProductById.mockResolvedValue(mockProduct);

    const generatePackingList = new GeneratePackingList(mockOrderRepository, mockProductRepository);
    const result = await generatePackingList.execute('2024-02-14');

    expect(result).toEqual([
      {
        order_id: '1',
        customer_name: 'John Doe',
        shipping_address: '123 Test St',
        items: [
          {
            product_id: 'P1',
            product_name: 'Test Product',
            quantity: 1
          }
        ]
      }
    ]);

    expect(mockOrderRepository.getOrdersByDate).toHaveBeenCalledWith('2024-02-14');
    expect(mockProductRepository.getProductById).toHaveBeenCalledWith('P1');
  });

  it('should handle empty orders array', async () => {
    mockOrderRepository.getOrdersByDate.mockResolvedValue([]);

    const generatePackingList = new GeneratePackingList(mockOrderRepository, mockProductRepository);
    const result = await generatePackingList.execute('2024-02-14');

    expect(result).toEqual([]);
    expect(mockProductRepository.getProductById).not.toHaveBeenCalled();
  });

  it('should throw error when product not found', async () => {
    mockOrderRepository.getOrdersByDate.mockResolvedValue([mockOrder]);
    mockProductRepository.getProductById.mockResolvedValue(null);

    const generatePackingList = new GeneratePackingList(mockOrderRepository, mockProductRepository);

    await expect(generatePackingList.execute('2024-02-14'))
      .rejects
      .toThrow('Product not found: P1');
  });

  it('should handle multiple line items and components', async () => {
    const orderWithMultipleItems: Order = {
      ...mockOrder,
      line_items: [
        {
          line_item_id: '1',
          product_id: 'P1',
          product_name: 'Test Product 1',
          price: 100,
          quantity: 2
        },
        {
          line_item_id: '2',
          product_id: 'P2',
          product_name: 'Test Product 2',
          price: 200,
          quantity: 1
        }
      ]
    };

    const product1: Product = {
      product_id: 'P1',
      product_name: 'Test Product 1',
      product_type: 'Type 1',
      components: [
        { component_id: 'C1', name: 'Component 1', quantity: 2, location: 'A1' }
      ]
    };

    const product2: Product = {
      product_id: 'P2',
      product_name: 'Test Product 2',
      product_type: 'Type 2',
      components: [
        { component_id: 'C2', name: 'Component 2', quantity: 3, location: 'B1' }
      ]
    };

    mockOrderRepository.getOrdersByDate.mockResolvedValue([orderWithMultipleItems]);
    mockProductRepository.getProductById
      .mockImplementation(async (id) => {
        if (id === 'P1') return product1;
        if (id === 'P2') return product2;
        return null;
      });

    const generatePackingList = new GeneratePackingList(mockOrderRepository, mockProductRepository);
    const result = await generatePackingList.execute('2024-02-14');

    expect(result).toEqual([
      {
        order_id: '1',
        customer_name: 'John Doe',
        shipping_address: '123 Test St',
        items: [
          {
            product_id: 'P1',
            product_name: 'Test Product 1',
            quantity: 2
          },
          {
            product_id: 'P2',
            product_name: 'Test Product 2',
            quantity: 1
          }
        ]
      }
    ]);
  });

  it('should handle repository errors', async () => {
    mockOrderRepository.getOrdersByDate.mockRejectedValue(new Error('Database error'));

    const generatePackingList = new GeneratePackingList(mockOrderRepository, mockProductRepository);

    await expect(generatePackingList.execute('2024-02-14'))
      .rejects
      .toThrow('Database error');
  });

  it('should handle product repository errors', async () => {
    mockOrderRepository.getOrdersByDate.mockResolvedValue([mockOrder]);
    mockProductRepository.getProductById.mockRejectedValue(new Error('Product database error'));

    const generatePackingList = new GeneratePackingList(mockOrderRepository, mockProductRepository);

    await expect(generatePackingList.execute('2024-02-14'))
      .rejects
      .toThrow('Product database error');
  });
}); 