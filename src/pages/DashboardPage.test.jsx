/**
 * DashboardPage.test.jsx
 * Tests for the DashboardPage component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import useCustomers from '../hooks/useCustomers';
import useTransactions from '../hooks/useTransactions';

jest.mock('../hooks/useCustomers');
jest.mock('../hooks/useTransactions');

const mockCustomers = [
  { customerId: 'C1', customerName: 'User 1', tier: 'Gold' },
  { customerId: 'C2', customerName: 'User 2', tier: 'Silver' },
];

const mockTransactions = [
  {
    customerId: 'C1',
    transactions: [
      { amount: 120, date: '2025-01-01', points: 90 },
      { amount: 80, date: '2025-01-15', points: 30 },
    ],
  },
];

describe('DashboardPage Component', () => {
  test('Positive: should render dashboard stats when data is available', () => {
    useCustomers.mockReturnValue({ customers: mockCustomers, loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: mockTransactions, loading: false, error: null });

    render(<DashboardPage />);

    expect(screen.getByText(/Dashboard Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/Top Customers by Reward Points/i)).toBeInTheDocument();
  });

  test('Positive: should show loading state while fetching data', () => {
    useCustomers.mockReturnValue({ customers: [], loading: true, error: null });
    useTransactions.mockReturnValue({ transactionData: [], loading: true, error: null });

    render(<DashboardPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('Positive: should show no data available when transactions are empty', () => {
    useCustomers.mockReturnValue({ customers: [], loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: [], loading: false, error: null });

    render(<DashboardPage />);
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  test('Negative: should show an error alert when transaction fetch fails', () => {
    useCustomers.mockReturnValue({ customers: [], loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: [], loading: false, error: 'Unable to load transactions' });

    render(<DashboardPage />);
    expect(screen.getByText(/Unable to load transactions/i)).toBeInTheDocument();
  });

  test('Negative: should show an error alert when customer fetch fails', () => {
    useCustomers.mockReturnValue({ customers: [], loading: false, error: 'Unable to load customers' });
    useTransactions.mockReturnValue({ transactionData: [], loading: false, error: null });

    render(<DashboardPage />);
    expect(screen.getByText(/Unable to load customers/i)).toBeInTheDocument();
  });

  test('Negative: should render zero values when no customer data exists', () => {
    useCustomers.mockReturnValue({ customers: [], loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: [], loading: false, error: null });

    render(<DashboardPage />);
    expect(screen.getByText(/Total Points Awarded/i)).toBeInTheDocument();
  });
});
