import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order } from '../../domain/entities/Order';
import { PickingItem, PackingOrder } from '../../domain/types';
import { apiClient } from '../../utils/api/axiosConfig';

export class OrderApi implements IOrderRepository {
  async getOrdersByDate(date: string): Promise<Order[]> {
    const response = await apiClient.get('/api/orders', {
      params: { date }
    });
    return response.data;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await apiClient.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      if ((error as any).response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async fetchPickingList(date: string): Promise<PickingItem[]> {
    const response = await apiClient.get('/api/warehouse/picking-list', {
      params: { date }
    });
    return response.data;
  }

  async fetchPackingList(date: string): Promise<PackingOrder[]> {
    const response = await apiClient.get('/api/warehouse/packing-list', {
      params: { date }
    });
    return response.data;
  }
} 