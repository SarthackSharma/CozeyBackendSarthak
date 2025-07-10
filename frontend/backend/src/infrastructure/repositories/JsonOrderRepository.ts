import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order } from '../../domain/entities/Order';
import * as fs from 'fs';
import * as path from 'path';

export class JsonOrderRepository implements IOrderRepository {
  private ordersPath: string;

  constructor() {
    this.ordersPath = path.join(__dirname, '..', '..', '..', 'data', 'orders.json');
  }

  async getOrdersByDate(date: string): Promise<Order[]> {
    try {
      const ordersContent = fs.readFileSync(this.ordersPath, 'utf-8');
      const ordersData = JSON.parse(ordersContent);
      
      if (!Array.isArray(ordersData.orders)) {
        throw new Error('Orders data is invalid - missing orders array');
      }

      return ordersData.orders.filter((order: Order) => order.order_date === date);
    } catch (error) {
      throw error;
    }
  }

  async saveOrder(order: Order): Promise<void> {
    try {
      const ordersContent = fs.readFileSync(this.ordersPath, 'utf-8');
      const ordersData = JSON.parse(ordersContent);
      
      if (!Array.isArray(ordersData.orders)) {
        throw new Error('Orders data is invalid - missing orders array');
      }

      ordersData.orders.push(order);
      fs.writeFileSync(this.ordersPath, JSON.stringify(ordersData, null, 2));
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const ordersContent = fs.readFileSync(this.ordersPath, 'utf-8');
      const ordersData = JSON.parse(ordersContent);
      
      if (!Array.isArray(ordersData.orders)) {
        throw new Error('Orders data is invalid - missing orders array');
      }

      const order = ordersData.orders.find((o: Order) => o.order_id === orderId);
      return order || null;
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(order: Order): Promise<void> {
    try {
      const ordersContent = fs.readFileSync(this.ordersPath, 'utf-8');
      const ordersData = JSON.parse(ordersContent);
      
      if (!Array.isArray(ordersData.orders)) {
        throw new Error('Orders data is invalid - missing orders array');
      }

      const index = ordersData.orders.findIndex((o: Order) => o.order_id === order.order_id);
      if (index === -1) {
        throw new Error(`Order ${order.order_id} not found`);
      }

      ordersData.orders[index] = order;
      fs.writeFileSync(this.ordersPath, JSON.stringify(ordersData, null, 2));
    } catch (error) {
      throw error;
    }
  }
} 