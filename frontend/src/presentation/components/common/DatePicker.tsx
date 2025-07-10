import React from 'react';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Box } from '@mui/material';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
  return (
    <Box sx={{ mb: 3, maxWidth: '300px' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MuiDatePicker
          label="Select Date"
          value={dayjs(selectedDate)}
          onChange={(newValue) => {
            if (newValue) {
              onDateChange(newValue.format('YYYY-MM-DD'));
            }
          }}
          slotProps={{
            textField: {
              size: "medium",
              sx: { width: '100%' }
            }
          }}
          sx={{ 
            '& .MuiInputBase-root': {
              borderRadius: 1
            }
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}; 