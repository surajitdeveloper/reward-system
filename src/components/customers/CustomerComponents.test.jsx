/**
 * CustomerComponents.test.jsx
 * Tests for CustomerTable, CustomerRow, and CustomerDetailsDialog.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerTable from './CustomerTable';
import CustomerRow from './CustomerRow';
import CustomerDetailsDialog from './CustomerDetailsDialog';
import TransactionRow from './TransactionRow';

const mockCustomers = [{ customerId: 'C1', customerName: 'John Doe', email: 'john@example.com', tier: 'Gold' }];
const mockTxns = [{ customerId: 'C1', transactions: [{ transactionId: 'T1', amount: 120, date: '2025-01-01', points: 90 }] }];

describe('Customer Components', () => {
  test('CustomerTable Positive: should render table with data', () => {
    render(
      <CustomerTable
        customers={mockCustomers}
        transactionData={mockTxns}
        onViewDetail={() => {}}
      />
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/90/)).toBeInTheDocument();
  });

  test('CustomerRow Positive: should render row data and transaction toggle', () => {
    render(
      <table>
        <tbody>
          <CustomerRow
            customer={mockCustomers[0]}
            transactions={mockTxns[0].transactions}
            totalPoints={90}
            onViewDetail={() => {}}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/90/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/toggle transaction details/i));
    expect(screen.getByText(/Recent Transactions/i)).toBeInTheDocument();
  });

  test('TransactionRow Positive: should display transaction fields correctly', () => {
    render(
      <table>
        <tbody>
          <TransactionRow transaction={mockTxns[0].transactions[0]} />
        </tbody>
      </table>
    );

    expect(screen.getByText(/T1/i)).toBeInTheDocument();
    expect(screen.getByText(/120\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/90 pts/i)).toBeInTheDocument();
  });

  test('CustomerDetailsDialog Positive: should render dialog when open', () => {
    render(
      <CustomerDetailsDialog
        open={true}
        customer={mockCustomers[0]}
        transactions={mockTxns[0].transactions}
        onClose={() => {}}
      />
    );

    expect(screen.getByText(/Customer Details/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  test('CustomerDetailsDialog Negative: should not render when closed', () => {
    render(
      <CustomerDetailsDialog
        open={false}
        customer={mockCustomers[0]}
        transactions={[]}
        onClose={() => {}}
      />
    );

    expect(screen.queryByText(/Customer Details/i)).not.toBeInTheDocument();
  });

  test('CustomerRow Negative: should render no transactions message if empty', () => {
    render(
      <table>
        <tbody>
          <CustomerRow
            customer={mockCustomers[0]}
            transactions={[]}
            totalPoints={0}
            onViewDetail={() => {}}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByLabelText(/toggle transaction details/i));
    expect(screen.getByText(/No recent transactions available/i)).toBeInTheDocument();
  });
});
