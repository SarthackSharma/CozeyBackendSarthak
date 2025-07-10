import React from 'react';
import { render } from '@testing-library/react';
import { PickingItem } from '../../../../domain/types';
import { PickingList } from '../PickingListView';

describe('PickingList', () => {
  const mockItems: PickingItem[] = [
    {
      product_id: '1',
      name: 'Test Item 1',
      quantity: 5,
      location: 'A1'
    },
    {
      product_id: '2',
      name: 'Test Item 2',
      quantity: 3,
      location: 'B2'
    }
  ];

  it('renders loading state', () => {
    const { getByText } = render(<PickingList selectedDate="2024-02-14" />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    const { getByText } = render(<PickingList selectedDate="2024-02-14" />);
    expect(getByText('No items to pick for the selected date.')).toBeInTheDocument();
  });

  it('renders items correctly', () => {
    const { getByText } = render(<PickingList selectedDate="2024-02-14" />);
    mockItems.forEach(item => {
      expect(getByText(item.name)).toBeInTheDocument();
      expect(getByText(item.quantity.toString())).toBeInTheDocument();
      expect(getByText(item.location)).toBeInTheDocument();
    });
  });
}); 