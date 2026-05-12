/**
 * CustomersPage.test.jsx
 * Tests for the CustomersPage component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomersPage from './CustomersPage';
import useCustomers from '../hooks/useCustomers';
import useTransactions from '../hooks/useTransactions';

jest.mock('../hooks/useCustomers');
jest.mock('../hooks/useTransactions');

const mockCustomers = [{ customerId: 'C1', customerName: 'John Doe', email: 'john@example.com' }];
const mockTransactions = [{ customerId: 'C1', transactions: [] }];

describe('CustomersPage Component', () => {
  test('Positive: should render customer management header', () => {
    useCustomers.mockReturnValue({ customers: mockCustomers, loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: mockTransactions, loading: false, error: null });

    render(<CustomersPage />);
    expect(screen.getByText(/Customer Management/i)).toBeInTheDocument();
  });

  test('Positive: should render customer table rows when data is present', () => {
    useCustomers.mockReturnValue({ customers: mockCustomers, loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: mockTransactions, loading: false, error: null });

    render(<CustomersPage />);
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('Positive: should show the table even when transactions are empty', () => {
    useCustomers.mockReturnValue({ customers: mockCustomers, loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: mockTransactions, loading: false, error: null });

    render(<CustomersPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('Negative: should show loading spinner while customer data is loading', () => {
    useCustomers.mockReturnValue({ customers: [], loading: true, error: null });
    useTransactions.mockReturnValue({ transactionData: [], loading: true, error: null });

    render(<CustomersPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('Negative: should show error when customer fetch fails', () => {
    useCustomers.mockReturnValue({ customers: [], loading: false, error: 'Failed to load customers' });
    useTransactions.mockReturnValue({ transactionData: [], loading: false, error: null });

    render(<CustomersPage />);
    expect(screen.getByText(/Failed to load customers/i)).toBeInTheDocument();
  });

  test('Negative: should show error when transaction fetch fails', () => {
    useCustomers.mockReturnValue({ customers: mockCustomers, loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: [], loading: false, error: 'Failed to load transactions' });

    render(<CustomersPage />);
    expect(screen.getByText(/Failed to load transactions/i)).toBeInTheDocument();
  });
});
