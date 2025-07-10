import { OrderValidation } from '../orderValidation';
import { Order, LineItem } from '../../../domain/entities/Order';
import { AppError } from '../../middleware/errorHandler';

describe('OrderValidation', () => {
  const validLineItem: LineItem = {
    line_item_id: '1',
    product_id: 'P1',
    product_name: 'Test Product',
    price: 100,
    quantity: 1
  };

  const validOrder: Order = {
    order_id: '1',
    order_total: 100,
    order_date: '2024-02-14',
    shipping_address: '123 Test St',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    line_items: [validLineItem]
  };

  describe('validateLineItem', () => {
    it('should not throw for valid line item', () => {
      expect(() => OrderValidation.validateLineItem(validLineItem)).not.toThrow();
    });

    it('should throw for missing line_item_id', () => {
      const invalidItem = { ...validLineItem, line_item_id: '' };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Line item ID is required');
    });

    it('should throw for missing product_id', () => {
      const invalidItem = { ...validLineItem, product_id: '' };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Product ID is required');
    });

    it('should throw for missing product_name', () => {
      const invalidItem = { ...validLineItem, product_name: '' };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Product name is required');
    });

    it('should throw for missing price', () => {
      const invalidItem = { ...validLineItem, price: undefined as any };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Price must be a number');
    });

    it('should throw for invalid price type', () => {
      const invalidItem = { ...validLineItem, price: '100' as any };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Price must be a number');
    });

    it('should throw for zero price', () => {
      const invalidItem = { ...validLineItem, price: 0 };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Price must be greater than 0');
    });

    it('should throw for negative price', () => {
      const invalidItem = { ...validLineItem, price: -100 };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Price must be greater than 0');
    });

    it('should throw for missing quantity', () => {
      const invalidItem = { ...validLineItem, quantity: undefined as any };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Quantity must be a number');
    });

    it('should throw for invalid quantity type', () => {
      const invalidItem = { ...validLineItem, quantity: '1' as any };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Quantity must be a number');
    });

    it('should throw for zero quantity', () => {
      const invalidItem = { ...validLineItem, quantity: 0 };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Quantity must be greater than 0');
    });

    it('should throw for negative quantity', () => {
      const invalidItem = { ...validLineItem, quantity: -1 };
      expect(() => OrderValidation.validateLineItem(invalidItem))
        .toThrow('Quantity must be greater than 0');
    });
  });

  describe('validateOrder', () => {
    it('should not throw for valid order', () => {
      expect(() => OrderValidation.validateOrder(validOrder)).not.toThrow();
    });

    it('should throw for missing order_id', () => {
      const invalidOrder = { ...validOrder, order_id: '' };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Order ID is required');
    });

    it('should throw for invalid order_total type', () => {
      const invalidOrder = { ...validOrder, order_total: '100' as any };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Order total must be a positive number');
    });

    it('should throw for zero order_total', () => {
      const invalidOrder = { ...validOrder, order_total: 0 };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Order total must be a positive number');
    });

    it('should throw for negative order_total', () => {
      const invalidOrder = { ...validOrder, order_total: -100 };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Order total must be a positive number');
    });

    it('should throw for missing order_date', () => {
      const invalidOrder = { ...validOrder, order_date: '' };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Order date is required');
    });

    it('should throw for missing shipping_address', () => {
      const invalidOrder = { ...validOrder, shipping_address: '' };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Shipping address is required');
    });

    it('should throw for missing customer_name', () => {
      const invalidOrder = { ...validOrder, customer_name: '' };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Customer name is required');
    });

    it('should throw for missing customer_email', () => {
      const invalidOrder = { ...validOrder, customer_email: '' };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Customer email is required');
    });

    it('should throw for empty line_items', () => {
      const invalidOrder = { ...validOrder, line_items: [] };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Order must have at least one line item');
    });

    it('should throw for invalid line items', () => {
      const invalidOrder = {
        ...validOrder,
        line_items: [{ ...validLineItem, price: -100 }]
      };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Invalid line item: Price must be greater than 0');
    });

    it('should throw when order total does not match line items', () => {
      const invalidOrder = {
        ...validOrder,
        order_total: 200, // Should be 100 (price * quantity)
        line_items: [validLineItem]
      };
      expect(() => OrderValidation.validateOrder(invalidOrder))
        .toThrow('Order total does not match sum of line items');
    });

    it('should handle multiple line items correctly', () => {
      const orderWithMultipleItems = {
        ...validOrder,
        order_total: 300,
        line_items: [
          validLineItem,
          { ...validLineItem, line_item_id: '2', price: 200 }
        ]
      };
      expect(() => OrderValidation.validateOrder(orderWithMultipleItems)).not.toThrow();
    });
  });
}); 