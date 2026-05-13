/**
 * RewardsPage.test.jsx
 * Tests for the RewardsPage component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import RewardsPage from './RewardsPage';
import useTransactions from '../hooks/useTransactions';

jest.mock('../hooks/useTransactions');

const mockTransactions = [
  {
    customerId: 'C1',
    transactions: [
      { amount: 120, date: '2025-01-01', points: 90 },
      { amount: 80, date: '2025-01-20', points: 30 },
    ],
  },
];

describe('RewardsPage Component', () => {
  beforeEach(() => {
    useTransactions.mockReturnValue({ transactionData: mockTransactions, loading: false, error: null });
  });

  test('Positive: should render analytics header', () => {
    render(<RewardsPage />);
    expect(screen.getByText(/Rewards Analytics/i)).toBeInTheDocument();
  });

  test('Positive: should render monthly points for January 2025', () => {
    render(<RewardsPage />);
    expect(screen.getByText(/January 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/120 pts/i)).toBeInTheDocument();
  });

  test('Positive: should show the program description card', () => {
    render(<RewardsPage />);
    expect(screen.getByText(/About the Program/i)).toBeInTheDocument();
    expect(screen.getByText(/1 point per dollar spent between/i)).toBeInTheDocument();
  });

  test('Negative: should show a loading spinner when transaction loading is true', () => {
    useTransactions.mockReturnValue({ transactionData: [], loading: true, error: null });
    render(<RewardsPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('Negative: should display an error alert when the transactions hook returns an error', () => {
    useTransactions.mockReturnValue({ transactionData: [], loading: false, error: 'Failed to load transactions' });
    render(<RewardsPage />);
    expect(screen.getByText(/Failed to load transactions/i)).toBeInTheDocument();
  });

  test('Negative: should show no data available when there are no rewards', () => {
    useTransactions.mockReturnValue({ transactionData: [], loading: false, error: null });
    render(<RewardsPage />);
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });
});
