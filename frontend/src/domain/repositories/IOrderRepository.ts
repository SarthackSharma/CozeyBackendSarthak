import { Order } from '../entities/Order';
import { PickingItem, PackingOrder } from '../types';

export interface IOrderRepository {
  getOrdersByDate(date: string): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | null>;
  fetchPickingList(date: string): Promise<PickingItem[]>;
  fetchPackingList(date: string): Promise<PackingOrder[]>;
} 