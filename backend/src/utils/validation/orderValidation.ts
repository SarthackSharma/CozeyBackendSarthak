import { Order, LineItem } from '../../domain/entities/Order';
import { AppError } from '../middleware/errorHandler';

export class OrderValidation {
  static validateLineItem(lineItem: LineItem): void {
    if (!lineItem.line_item_id) {
      throw new AppError(400, 'Line item ID is required');
    }
    if (!lineItem.product_id) {
      throw new AppError(400, 'Product ID is required');
    }
    if (!lineItem.product_name) {
      throw new AppError(400, 'Product name is required');
    }
    if (typeof lineItem.price !== 'number') {
      throw new AppError(400, 'Price must be a number');
    }
    if (lineItem.price <= 0) {
      throw new AppError(400, 'Price must be greater than 0');
    }
    if (typeof lineItem.quantity !== 'number') {
      throw new AppError(400, 'Quantity must be a number');
    }
    if (lineItem.quantity <= 0) {
      throw new AppError(400, 'Quantity must be greater than 0');
    }
  }

  static validateOrder(order: Order): void {
    if (!order.order_id) {
      throw new AppError(400, 'Order ID is required');
    }
    if (typeof order.order_total !== 'number' || order.order_total <= 0) {
      throw new AppError(400, 'Order total must be a positive number');
    }
    if (!order.order_date) {
      throw new AppError(400, 'Order date is required');
    }
    if (!order.shipping_address) {
      throw new AppError(400, 'Shipping address is required');
    }
    if (!order.customer_name) {
      throw new AppError(400, 'Customer name is required');
    }
    if (!order.customer_email) {
      throw new AppError(400, 'Customer email is required');
    }
    if (!Array.isArray(order.line_items) || order.line_items.length === 0) {
      throw new AppError(400, 'Order must have at least one line item');
    }

    // Validate each line item
    order.line_items.forEach(lineItem => {
      try {
        this.validateLineItem(lineItem);
      } catch (error) {
        if (error instanceof AppError) {
          throw new AppError(400, `Invalid line item: ${error.message}`);
        }
        throw error;
      }
    });

    // Validate that order total matches sum of line items
    const calculatedTotal = order.line_items.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (Math.abs(calculatedTotal - order.order_total) > 0.01) { // Allow for small floating point differences
      throw new AppError(400, 'Order total does not match sum of line items');
    }
  }

  static validateOrderDate(date: string): void {
    if (typeof date !== 'string') {
      throw new AppError(400, 'Invalid date');
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new AppError(400, 'Invalid date format. Use YYYY-MM-DD');
    }

    const [year, month, day] = date.split('-').map(Number);
    
    // Check month validity
    if (month < 1 || month > 12) {
      throw new AppError(400, 'Invalid date');
    }

    // Check day validity
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      throw new AppError(400, 'Invalid date');
    }

    const orderDate = new Date(date);
    if (isNaN(orderDate.getTime())) {
      throw new AppError(400, 'Invalid date');
    }
  }
} 