import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: jest.fn()
}));

jest.mock('./presentation/components/PickingList/PickingListView', () => ({
  PickingList: () => <div data-testid="picking-list">Picking List</div>
}));

jest.mock('./presentation/components/PackingList/PackingListView', () => ({
  PackingList: () => <div data-testid="packing-list">Packing List</div>
}));

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
