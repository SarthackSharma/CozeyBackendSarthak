import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PickingListContainer } from '../PickingListContainer';
import { useOrderRepository } from '../../../../hooks/useOrderRepository';
import { formatDateForInput } from '../../../../utils/formatters/dateFormatter';

// Mock the useOrderRepository hook
jest.mock('../../../../hooks/useOrderRepository');

describe('PickingListContainer', () => {
  const mockOrderRepository = {
    fetchPickingList: jest.fn()
  };

  const mockPickingItems = [
    {
      product_id: 'P1',
      name: 'Component 1',
      quantity: 5,
      location: 'A1'
    },
    {
      product_id: 'P2',
      name: 'Component 2',
      quantity: 3,
      location: 'B2'
    }
  ];

  beforeEach(() => {
    (useOrderRepository as jest.Mock).mockReturnValue(mockOrderRepository);
    mockOrderRepository.fetchPickingList.mockResolvedValue(mockPickingItems);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render initial state correctly', async () => {
    render(<PickingListContainer />);
    
    // Check if date picker is rendered with today's date
    const dateInput = screen.getByLabelText('Select Date:') as HTMLInputElement;
    expect(dateInput.value).toBe(formatDateForInput(new Date()));
    
    // Should show loading initially
    expect(screen.getByText('Loading picking list...')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading picking list...')).not.toBeInTheDocument();
    });
    
    // Check if items are rendered
    expect(screen.getByText('Component 1')).toBeInTheDocument();
    expect(screen.getByText('Component 2')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('B2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should handle date change', async () => {
    render(<PickingListContainer />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText('Loading picking list...')).not.toBeInTheDocument();
    });
    
    // Change date
    const dateInput = screen.getByLabelText('Select Date:') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } });
    
    // Should show loading state again
    expect(screen.getByText('Loading picking list...')).toBeInTheDocument();
    
    // Verify the repository was called with the new date
    await waitFor(() => {
      expect(mockOrderRepository.fetchPickingList).toHaveBeenCalledWith('2024-03-15');
    });
  });

  it('should handle error state', async () => {
    const errorMessage = 'Failed to fetch picking list';
    mockOrderRepository.fetchPickingList.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<PickingListContainer />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch picking list. Please try again.')).toBeInTheDocument();
    });
  });

  it('should handle empty list', async () => {
    mockOrderRepository.fetchPickingList.mockResolvedValueOnce([]);
    
    render(<PickingListContainer />);
    
    await waitFor(() => {
      expect(screen.getByText('No items to pick for the selected date.')).toBeInTheDocument();
    });
  });
}); 