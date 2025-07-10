import { GeneratePickingList } from '../GeneratePickingList';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Order, LineItem } from '../../../domain/entities/Order';
import { Product, Component } from '../../../domain/entities/Product';

describe('GeneratePickingList', () => {
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
    getProductById: jest.fn(),
    getAllProducts: jest.fn()
  };

  const generatePickingList = new GeneratePickingList(
    mockOrderRepository,
    mockProductRepository
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockOrderRepository.getOrdersByDate.mockResolvedValue([mockOrder]);
    mockProductRepository.getAllProducts.mockResolvedValue([mockProduct]);
  });

  it('should generate picking list for given date', async () => {
    const result = await generatePickingList.execute('2024-02-14');

    expect(result).toEqual([
      {
        order_id: '1',
        customer_name: 'John Doe',
        shipping_address: '123 Test St',
        items: [
          {
            component_id: 'C1',
            name: 'Test Component',
            quantity: 2, // quantity is multiplied by line item quantity
            location: 'A1'
          }
        ]
      }
    ]);

    expect(mockOrderRepository.getOrdersByDate).toHaveBeenCalledWith('2024-02-14');
    expect(mockProductRepository.getAllProducts).toHaveBeenCalled();
  });

  it('should handle empty orders array', async () => {
    mockOrderRepository.getOrdersByDate.mockResolvedValueOnce([]);
    
    const result = await generatePickingList.execute('2024-02-14');
    expect(result).toEqual([]);
  });

  it('should throw error when product not found', async () => {
    const orderWithInvalidProduct = {
      ...mockOrder,
      line_items: [{
        ...mockOrder.line_items[0],
        product_id: 'INVALID_ID'
      }]
    };
    mockOrderRepository.getOrdersByDate.mockResolvedValueOnce([orderWithInvalidProduct]);

    await expect(generatePickingList.execute('2024-02-14'))
      .rejects
      .toThrow('Product not found: INVALID_ID');
  });

  it('should handle multiple line items and components', async () => {
    const complexOrder: Order = {
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

    const complexProducts: Product[] = [
      {
        product_id: 'P1',
        product_name: 'Test Product 1',
        product_type: 'Type 1',
        components: [
          {
            component_id: 'C1',
            name: 'Component 1',
            quantity: 2,
            location: 'A1'
          }
        ]
      },
      {
        product_id: 'P2',
        product_name: 'Test Product 2',
        product_type: 'Type 2',
        components: [
          {
            component_id: 'C2',
            name: 'Component 2',
            quantity: 1,
            location: 'B1'
          }
        ]
      }
    ];

    mockOrderRepository.getOrdersByDate.mockResolvedValueOnce([complexOrder]);
    mockProductRepository.getAllProducts.mockResolvedValueOnce(complexProducts);

    const result = await generatePickingList.execute('2024-02-14');

    expect(result).toEqual([
      {
        order_id: complexOrder.order_id,
        customer_name: complexOrder.customer_name,
        shipping_address: complexOrder.shipping_address,
        items: [
          {
            component_id: 'C1',
            name: 'Component 1',
            quantity: 4, // 2 (component quantity) * 2 (line item quantity)
            location: 'A1'
          },
          {
            component_id: 'C2',
            name: 'Component 2',
            quantity: 1, // 1 (component quantity) * 1 (line item quantity)
            location: 'B1'
          }
        ]
      }
    ]);
  });
}); 