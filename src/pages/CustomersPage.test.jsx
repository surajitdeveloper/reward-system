/**
 * CustomersPage.test.jsx
 * Tests for the CustomersPage component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomersPage from './CustomersPage';
import useCustomers from '../hooks/useCustomers';
import useTransactions from '../hooks/useTransactions';

jest.mock('../hooks/useCustomers');
jest.mock('../hooks/useTransactions');

const mockCustomers = [{ customerId: 'C1', customerName: 'John Doe', email: 'john@example.com' }];
const mockTransactions = [{ customerId: 'C1', transactions: [] }];

describe('CustomersPage Component', () => {
  
  beforeEach(() => {
    useCustomers.mockReturnValue({ customers: mockCustomers, loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: mockTransactions, loading: false, error: null });
  });

  test('Positive: should render customer management header', () => {
    render(
      <BrowserRouter>
        <CustomersPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Customer Management/i)).toBeInTheDocument();
  });

  test('Positive: should render the table when data is loaded', () => {
    useCustomers.mockReturnValue({ customers: mockCustomers, loading: false, error: null });
    useTransactions.mockReturnValue({ transactionData: mockTransactions, loading: false, error: null });

    render(
      <BrowserRouter>
        <CustomersPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('Negative: should show error message', () => {
    useCustomers.mockReturnValue({ customers: [], loading: false, error: 'Network Error' });
    useTransactions.mockReturnValue({ transactionData: [], loading: false, error: null });

    render(
      <BrowserRouter>
        <CustomersPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
  });
});
