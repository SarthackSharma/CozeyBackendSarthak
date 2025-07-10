import { WarehouseService } from '../warehouseService';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('WarehouseService', () => {
  let warehouseService: WarehouseService;
  const mockDate = '2024-07-07';

  const mockProducts = {
    products: [
      {
        product_id: 'GB001',
        product_name: 'Valentines Box',
        price: 149.99,
        description: 'A romantic gift box',
        components: [
          { component_id: 'P001', name: 'Red Roses Bouquet', quantity: 1, location: 'A1' },
          { component_id: 'P002', name: 'Box of chocolates', quantity: 1, location: 'B2' }
        ]
      }
    ]
  };

  const mockOrders = {
    orders: [
      {
        order_id: 'ORD001',
        order_total: 149.99,
        order_date: '2024-07-07',
        shipping_address: '100 Test St',
        customer_name: 'John Test',
        customer_email: 'john@test.com',
        line_items: [
          {
            line_item_id: 'LI001',
            product_id: 'GB001',
            product_name: 'Valentines Box',
            price: 149.99,
            quantity: 1
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
      if (filePath.includes('products.json')) {
        return JSON.stringify(mockProducts);
      }
      if (filePath.includes('orders.json')) {
        return JSON.stringify(mockOrders);
      }
      throw new Error('Unexpected file path');
    });

    warehouseService = new WarehouseService();
  });

  describe('constructor', () => {
    it('should throw error if products file does not exist', () => {
      (fs.existsSync as jest.Mock)
        .mockImplementation((path) => !path.includes('products.json'));
      
      expect(() => new WarehouseService()).toThrow('Products file missing');
    });

    it('should throw error if orders file does not exist', () => {
      (fs.existsSync as jest.Mock)
        .mockImplementation((path) => !path.includes('orders.json'));
      
      expect(() => new WarehouseService()).toThrow('Orders file missing');
    });

    it('should throw error if products file has invalid JSON', () => {
      (fs.readFileSync as jest.Mock)
        .mockImplementation((path) => {
          if (path.includes('products.json')) {
            return 'invalid json';
          }
          return JSON.stringify(mockOrders);
        });
      
      expect(() => new WarehouseService()).toThrow(expect.any(SyntaxError));
    });

    it('should throw error if products data is missing products array', () => {
      (fs.readFileSync as jest.Mock)
        .mockImplementation((path) => {
          if (path.includes('products.json')) {
            return JSON.stringify({ notProducts: [] });
          }
          return JSON.stringify(mockOrders);
        });
      
      expect(() => new WarehouseService()).toThrow('Products data is invalid');
    });
  });

  describe('getOrdersByDate', () => {
    it('should throw error if orders file has invalid JSON', () => {
      (fs.readFileSync as jest.Mock)
        .mockImplementation((path) => {
          if (path.includes('orders.json')) {
            return 'invalid json';
          }
          return JSON.stringify(mockProducts);
        });
      
      expect(() => warehouseService.generatePickingList(mockDate)).toThrow(expect.any(SyntaxError));
    });

    it('should throw error if orders data is missing orders array', () => {
      (fs.readFileSync as jest.Mock)
        .mockImplementation((path) => {
          if (path.includes('orders.json')) {
            return JSON.stringify({ notOrders: [] });
          }
          return JSON.stringify(mockProducts);
        });
      
      expect(() => warehouseService.generatePickingList(mockDate)).toThrow('Orders data is invalid');
    });

    it('should handle file read errors', () => {
      (fs.readFileSync as jest.Mock)
        .mockImplementation((path) => {
          if (path.includes('orders.json')) {
            throw new Error('Permission denied');
          }
          return JSON.stringify(mockProducts);
        });
      
      expect(() => warehouseService.generatePickingList(mockDate)).toThrow('Permission denied');
    });

    it('should validate date format', () => {
      expect(() => warehouseService.generatePickingList('invalid-date')).not.toThrow();
      expect(warehouseService.generatePickingList('invalid-date')).toHaveLength(0);
    });
  });

  describe('generatePickingList', () => {
    it('should generate correct picking list for a given date', () => {
      const result = warehouseService.generatePickingList(mockDate);
      
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            product_id: 'P001',
            name: 'Red Roses Bouquet',
            quantity: 1,
            location: 'A1'
          }),
          expect.objectContaining({
            product_id: 'P002',
            name: 'Box of chocolates',
            quantity: 1,
            location: 'B2'
          })
        ])
      );
    });

    it('should return empty array for date with no orders', () => {
      const result = warehouseService.generatePickingList('2024-07-08');
      expect(result).toHaveLength(0);
    });

    it('should throw error for invalid product reference', () => {
      const ordersWithInvalidProduct = {
        orders: [{
          ...mockOrders.orders[0],
          line_items: [{
            ...mockOrders.orders[0].line_items[0],
            product_id: 'INVALID'
          }]
        }]
      };

      (fs.readFileSync as jest.Mock)
        .mockImplementation((path) => {
          if (path.includes('orders.json')) {
            return JSON.stringify(ordersWithInvalidProduct);
          }
          return JSON.stringify(mockProducts);
        });

      expect(() => warehouseService.generatePickingList(mockDate))
        .toThrow('Product INVALID not found in catalog');
    });

    it('should aggregate quantities correctly for multiple orders', () => {
      const multipleOrders = {
        orders: [
          mockOrders.orders[0],
          {
            ...mockOrders.orders[0],
            order_id: 'ORD002',
            line_items: [{
              ...mockOrders.orders[0].line_items[0],
              line_item_id: 'LI002',
              quantity: 2
            }]
          }
        ]
      };

      (fs.readFileSync as jest.Mock)
        .mockImplementation((path) => {
          if (path.includes('orders.json')) {
            return JSON.stringify(multipleOrders);
          }
          return JSON.stringify(mockProducts);
        });

      const result = warehouseService.generatePickingList(mockDate);
      
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            product_id: 'P001',
            name: 'Red Roses Bouquet',
            quantity: 3,
            location: 'A1'
          }),
          expect.objectContaining({
            product_id: 'P002',
            name: 'Box of chocolates',
            quantity: 3,
            location: 'B2'
          })
        ])
      );
    });
  });

  describe('generatePackingList', () => {
    it('should generate correct packing list for a given date', () => {
      const result = warehouseService.generatePackingList(mockDate);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        order_id: 'ORD001',
        order_date: '2024-07-07',
        customer_name: 'John Test',
        shipping_address: '100 Test St',
        items: [{
          gift_box_name: 'Valentines Box',
          components: [
            { component_id: 'P001', name: 'Red Roses Bouquet', quantity: 1, location: 'A1' },
            { component_id: 'P002', name: 'Box of chocolates', quantity: 1, location: 'B2' }
          ]
        }]
      });
    });

    it('should return empty array for date with no orders', () => {
      const result = warehouseService.generatePackingList('2024-07-08');
      expect(result).toHaveLength(0);
    });

    it('should throw error for invalid product reference', () => {
      const ordersWithInvalidProduct = {
        orders: [{
          ...mockOrders.orders[0],
          line_items: [{
            ...mockOrders.orders[0].line_items[0],
            product_id: 'INVALID'
          }]
        }]
      };

      (fs.readFileSync as jest.Mock)
        .mockImplementation((path) => {
          if (path.includes('orders.json')) {
            return JSON.stringify(ordersWithInvalidProduct);
          }
          return JSON.stringify(mockProducts);
        });

      expect(() => warehouseService.generatePackingList(mockDate))
        .toThrow('Product INVALID not found in catalog');
    });

    it('should handle multiple items per order', () => {
      const orderWithMultipleItems = {
        orders: [{
          ...mockOrders.orders[0],
          line_items: [
            mockOrders.orders[0].line_items[0],
            {
              line_item_id: 'LI002',
              product_id: 'GB001',
              product_name: 'Valentines Box',
              price: 149.99,
              quantity: 2
            }
          ]
        }]
      };

      (fs.readFileSync as jest.Mock)
        .mockImplementation((path) => {
          if (path.includes('orders.json')) {
            return JSON.stringify(orderWithMultipleItems);
          }
          return JSON.stringify(mockProducts);
        });

      const result = warehouseService.generatePackingList(mockDate);
      
      expect(result).toHaveLength(1);
      expect(result[0].items).toHaveLength(2);
      expect(result[0].items[1].components[0].quantity).toBe(2);
      expect(result[0].items[1].components[1].quantity).toBe(2);
    });
  });
}); 