import { JsonOrderRepository } from '../JsonOrderRepository';
import { Order } from '../../../domain/entities/Order';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('JsonOrderRepository', () => {
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

  const mockOrdersData = {
    orders: [mockOrder]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (path.join as jest.Mock).mockReturnValue('/mock/path/orders.json');
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockOrdersData));
  });

  describe('getOrdersByDate', () => {
    it('should return orders for given date', async () => {
      const repository = new JsonOrderRepository();
      const orders = await repository.getOrdersByDate('2024-02-14');

      expect(orders).toEqual([mockOrder]);
      expect(fs.readFileSync).toHaveBeenCalledWith('/mock/path/orders.json', 'utf-8');
    });

    it('should return empty array for date with no orders', async () => {
      const repository = new JsonOrderRepository();
      const orders = await repository.getOrdersByDate('2024-02-15');

      expect(orders).toEqual([]);
    });

    it('should throw error for invalid JSON', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
      const repository = new JsonOrderRepository();

      await expect(repository.getOrdersByDate('2024-02-14'))
        .rejects
        .toThrow();
    });

    it('should throw error for missing orders array', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('{"data": []}');
      const repository = new JsonOrderRepository();

      await expect(repository.getOrdersByDate('2024-02-14'))
        .rejects
        .toThrow('Orders data is invalid - missing orders array');
    });
  });

  describe('saveOrder', () => {
    it('should save new order', async () => {
      const repository = new JsonOrderRepository();
      const newOrder: Order = {
        ...mockOrder,
        order_id: '2'
      };

      await repository.saveOrder(newOrder);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/path/orders.json',
        JSON.stringify({
          orders: [...mockOrdersData.orders, newOrder]
        }, null, 2)
      );
    });

    it('should throw error for invalid JSON', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
      const repository = new JsonOrderRepository();

      await expect(repository.saveOrder(mockOrder))
        .rejects
        .toThrow();
    });

    it('should throw error for missing orders array', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('{"data": []}');
      const repository = new JsonOrderRepository();

      await expect(repository.saveOrder(mockOrder))
        .rejects
        .toThrow('Orders data is invalid - missing orders array');
    });
  });

  describe('getOrderById', () => {
    it('should return order by id', async () => {
      const repository = new JsonOrderRepository();
      const order = await repository.getOrderById('1');

      expect(order).toEqual(mockOrder);
    });

    it('should return null for non-existent order', async () => {
      const repository = new JsonOrderRepository();
      const order = await repository.getOrderById('non-existent');

      expect(order).toBeNull();
    });

    it('should throw error for invalid JSON', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
      const repository = new JsonOrderRepository();

      await expect(repository.getOrderById('1'))
        .rejects
        .toThrow();
    });

    it('should throw error for missing orders array', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('{"data": []}');
      const repository = new JsonOrderRepository();

      await expect(repository.getOrderById('1'))
        .rejects
        .toThrow('Orders data is invalid - missing orders array');
    });
  });

  describe('updateOrder', () => {
    it('should update existing order', async () => {
      const repository = new JsonOrderRepository();
      const updatedOrder: Order = {
        ...mockOrder,
        order_total: 200
      };

      await repository.updateOrder(updatedOrder);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/path/orders.json',
        JSON.stringify({
          orders: [updatedOrder]
        }, null, 2)
      );
    });

    it('should throw error for non-existent order', async () => {
      const repository = new JsonOrderRepository();
      const nonExistentOrder: Order = {
        ...mockOrder,
        order_id: 'non-existent'
      };

      await expect(repository.updateOrder(nonExistentOrder))
        .rejects
        .toThrow('Order non-existent not found');
    });

    it('should throw error for invalid JSON', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
      const repository = new JsonOrderRepository();

      await expect(repository.updateOrder(mockOrder))
        .rejects
        .toThrow();
    });

    it('should throw error for missing orders array', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('{"data": []}');
      const repository = new JsonOrderRepository();

      await expect(repository.updateOrder(mockOrder))
        .rejects
        .toThrow('Orders data is invalid - missing orders array');
    });
  });
}); 