import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { PickingItem } from '../../../domain/types';

interface PickingListProps {
  selectedDate: string;
  orders: PickingItem[];
  loading: boolean;
  error: Error | null;
}

export const PickingList: React.FC<PickingListProps> = ({ selectedDate, orders, loading, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error.message || 'Failed to fetch picking list'}</Alert>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box p={3}>
        <Alert severity="info">No items to pick for the selected date.</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper elevation={2}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>Picking List for {selectedDate}</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell>{item.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}; 