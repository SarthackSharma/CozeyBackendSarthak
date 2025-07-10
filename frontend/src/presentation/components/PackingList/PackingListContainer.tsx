import React, { useState } from 'react';
import { useOrderRepository } from '../../../hooks/useOrderRepository';
import { PackingList } from './PackingListView';
import { useAsync } from '../../../utils/hooks/useAsync';
import { Box, CircularProgress, Alert } from '@mui/material';
import { PackingOrder } from '../../../domain/types';
import { DatePicker } from '../common/DatePicker';

const DEFAULT_DATE = '2024-02-14';

export const PackingListContainer: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
  const orderRepository = useOrderRepository();
  const { execute, data: orders, loading, error } = useAsync<PackingOrder[]>();

  React.useEffect(() => {
    execute(() => orderRepository.fetchPackingList(selectedDate));
  }, [selectedDate, orderRepository, execute]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <Box>
      <DatePicker
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      {loading && (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box p={3}>
          <Alert severity="error">Failed to fetch packing list. Please try again.</Alert>
        </Box>
      )}
      {!loading && !error && (
        <PackingList 
          selectedDate={selectedDate}
          orders={orders || []}
        />
      )}
    </Box>
  );
}; 