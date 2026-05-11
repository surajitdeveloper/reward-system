/**
 * DashboardPage.test.jsx
 * Tests for the DashboardPage component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import useCustomers from '../hooks/useCustomers';
import useTransactions from '../hooks/useTransactions';

// Mock the hooks
jest.mock('../hooks/useCustomers');
jest.mock('../hooks/useTransactions');

const mockCustomers = [
  { customerId: 'C1', customerName: 'User 1' }
];

const mockTransactions = [
  { customerId: 'C1', transactions: [{ amount: 120, date: '2025-01-01' }] }
];

describe('DashboardPage Component', () => {
  
  beforeEach(() => {
    useCustomers.mockReturnValue({ customers: mockCustomers, loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: mockTransactions, loading: false, error: null });
  });

  test('Positive: should render dashboard stats', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/Reward Points/i)).toBeInTheDocument();
  });

  test('Positive: should show loading state', () => {
    useCustomers.mockReturnValue({ customers: [], loading: true, error: null });
    useTransactions.mockReturnValue({ transactionData: [], loading: true, error: null });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('Negative: should show error alert', () => {
    useCustomers.mockReturnValue({ customers: [], loading: false, error: 'Failed to load' });
    useTransactions.mockReturnValue({ transactionData: [], loading: false, error: null });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
  });
});
