import { useMemo } from 'react';
import { OrderApi } from '../infrastructure/api/OrderApi';

export const useOrderRepository = () => {
  return useMemo(() => new OrderApi(), []);
}; 