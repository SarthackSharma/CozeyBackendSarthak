import { Order } from '../entities/Order';

export interface IOrderRepository {
  getOrdersByDate(date: string): Promise<Order[]>;
  saveOrder(order: Order): Promise<void>;
  getOrderById(orderId: string): Promise<Order | null>;
  updateOrder(order: Order): Promise<void>;
} 