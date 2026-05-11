/**
 * RewardsPage.test.jsx
 * Tests for the RewardsPage component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RewardsPage from './RewardsPage';
import useCustomers from '../hooks/useCustomers';
import useTransactions from '../hooks/useTransactions';

jest.mock('../hooks/useCustomers');
jest.mock('../hooks/useTransactions');

const mockCustomers = [{ customerId: 'C1', customerName: 'John Doe' }];
const mockTransactions = [{ customerId: 'C1', transactions: [{ amount: 120, date: '2025-01-01' }] }];

describe('RewardsPage Component', () => {
  
  beforeEach(() => {
    useCustomers.mockReturnValue({ customers: mockCustomers, loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: mockTransactions, loading: false, error: null });
  });

  test('Positive: should render rewards summary header', () => {
    render(
      <BrowserRouter>
        <RewardsPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Rewards Summary/i)).toBeInTheDocument();
  });

  test('Positive: should render points per month', () => {
    render(
      <BrowserRouter>
        <RewardsPage />
      </BrowserRouter>
    );
    // Since mock transactions has 120, it should be 90 points
    expect(screen.getByText(/90/i)).toBeInTheDocument();
  });

  test('Negative: should show loading state', () => {
    useCustomers.mockReturnValue({ loading: true });
    render(
      <BrowserRouter>
        <RewardsPage />
      </BrowserRouter>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
