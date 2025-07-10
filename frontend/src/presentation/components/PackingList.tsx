import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import { getPackingList } from '../services/api';
import { PackingOrder } from '../../domain/types';

interface PackingListProps {
  selectedDate: string;
}

export const PackingList: React.FC<PackingListProps> = ({ selectedDate }) => {
  const [orders, setOrders] = useState<PackingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackingList = async () => {
      try {
        console.log('Fetching packing list for date:', selectedDate);
        setLoading(true);
        setError(null);
        const data = await getPackingList(selectedDate);
        console.log('Received packing list data:', data);
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching packing list:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch packing list';
        setError(`Error: ${errorMessage}. Check console for details.`);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchPackingList();
    }
  }, [selectedDate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  if (!orders.length) {
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Alert severity="info">
          No orders found for the selected date ({selectedDate}). Please select a different date.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Packing List for {selectedDate}
      </Typography>
      {orders.map((order) => (
        <Paper key={order.order_id} sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Order #{order.order_id}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Customer: {order.customer_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Shipping Address: {order.shipping_address}
          </Typography>
          {order.items.map((item, itemIndex) => (
            <Box key={itemIndex} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Gift Box: {item.gift_box_name}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item.components.map((component, componentIndex) => (
                      <TableRow key={componentIndex}>
                        <TableCell>{component.name}</TableCell>
                        <TableCell align="right">{component.quantity}</TableCell>
                        <TableCell align="right">{component.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Paper>
      ))}
    </Box>
  );
}; 