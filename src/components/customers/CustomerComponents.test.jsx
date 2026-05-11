/**
 * CustomerComponents.test.jsx
 * Tests for CustomerTable, CustomerRow, and CustomerDetailsDialog.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerTable from './CustomerTable';
import CustomerRow from './CustomerRow';
import CustomerDetailsDialog from './CustomerDetailsDialog';

const mockCustomers = [{ customerId: 'C1', customerName: 'John Doe', email: 'john@example.com' }];
const mockTxns = [{ customerId: 'C1', transactions: [{ amount: 120, date: '2025-01-01', points: 90 }] }];

describe('Customer Components', () => {
  
  test('CustomerTable Positive: should render table with data', () => {
    render(
      <CustomerTable 
        customers={mockCustomers} 
        transactionData={mockTxns} 
        onViewDetail={() => {}} 
      />
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('CustomerRow Positive: should render row data', () => {
    render(
      <table>
        <tbody>
          <CustomerRow 
            customer={mockCustomers[0]} 
            totalPoints={90} 
            onViewDetail={() => {}} 
          />
        </tbody>
      </table>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
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
});
