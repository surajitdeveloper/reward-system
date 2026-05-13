/**
 * CustomerTable.jsx
 * Simple customer list table without sorting or pagination.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CustomerRow from './CustomerRow';
import { calculateTotalPoints } from '../../utils/rewardCalculator';

const CustomerTable = ({ customers, transactionData, onViewDetail }) => {
  const getCustomerTransactions = (customerId) => {
    const data = transactionData?.find((c) => c.customerId === customerId);
    return data ? data.transactions : [];
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
      <Table aria-label="customer list table">
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            <TableCell />
            <TableCell>Customer ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Tier</TableCell>
            <TableCell align="right">Total Points</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => {
            const transactions = getCustomerTransactions(customer.customerId);
            const totalPoints = calculateTotalPoints(transactions);
            return (
              <CustomerRow
                key={customer.customerId}
                customer={customer}
                transactions={transactions}
                totalPoints={totalPoints}
                onViewDetail={onViewDetail}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

CustomerTable.propTypes = {
  customers: PropTypes.arrayOf(PropTypes.object).isRequired,
  transactionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewDetail: PropTypes.func.isRequired,
};

export default CustomerTable;
