import { apiClient } from '../../utils/api/axiosConfig';
import { PickingItem, PackingOrder } from '../../domain/types';

export const getPickingList = async (date: string): Promise<PickingItem[]> => {
  const response = await apiClient.get('/api/warehouse/picking-list', {
    params: { date }
  });
  return response.data;
};

export const getPackingList = async (date: string): Promise<PackingOrder[]> => {
  const response = await apiClient.get('/api/warehouse/packing-list', {
    params: { date }
  });
  return response.data;
}; 