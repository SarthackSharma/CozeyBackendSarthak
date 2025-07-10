import React, { useState } from 'react';
import { useOrderRepository } from '../../../hooks/useOrderRepository';
import { PickingList } from './PickingListView';
import { DatePicker } from '../common/DatePicker';
import { useAsync } from '../../../utils/hooks/useAsync';
import { formatDateForInput } from '../../../utils/formatters/dateFormatter';
import { PickingItem } from '../../../domain/types';

const DEFAULT_DATE = '2024-02-14';

export const PickingListContainer: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
  const orderRepository = useOrderRepository();
  const { execute, data: orders, loading, error } = useAsync<PickingItem[]>();

  React.useEffect(() => {
    execute(() => orderRepository.fetchPickingList(selectedDate));
  }, [selectedDate, orderRepository, execute]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <DatePicker
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      {error && <div className="error-message">Failed to fetch picking list. Please try again.</div>}
      <PickingList 
        selectedDate={selectedDate}
        orders={orders || []}
        loading={loading}
        error={error}
      />
    </div>
  );
}; 