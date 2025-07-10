import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import { PackingOrder, PackingOrderItem, Component } from '../../../domain/types';

interface PackingListProps {
  selectedDate: string;
  orders: PackingOrder[];
}

export const PackingList: React.FC<PackingListProps> = ({ selectedDate, orders }) => {
  if (orders.length === 0) {
    return (
      <Box p={3}>
        <Alert severity="info">No orders found for the selected date.</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {orders.map((order, index) => (
        <Paper key={order.order_id} elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order #{order.order_id}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Date: {order.order_date}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Customer: {order.customer_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Shipping Address: {order.shipping_address}
          </Typography>
          {order.items.map((item: PackingOrderItem, itemIndex: number) => (
            <Box key={itemIndex} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Gift Box: {item.gift_box_name}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Component</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item.components.map((component: Component, componentIndex: number) => (
                    <TableRow key={componentIndex}>
                      <TableCell>{component.name}</TableCell>
                      <TableCell align="right">{component.quantity}</TableCell>
                      <TableCell>{component.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ))}
        </Paper>
      ))}
    </Box>
  );
}; 