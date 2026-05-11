/**
 * CustomerTable.js
 * Main table listing all customers with sorting and pagination.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CustomerRow from './CustomerRow';
import { calculateTotalPoints } from '../../utils/rewardCalculator';
import { CUSTOMER_TABLE_COLUMNS, DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from '../../constants/appConstants';

const CustomerTable = ({ customers, transactionData, onViewDetail }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [orderBy, setOrderBy] = useState('customerName');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Find transaction data for a specific customer
  const getCustomerTransactions = (customerId) => {
    const data = transactionData?.find(c => c.customerId === customerId);
    return data ? data.transactions : [];
  };

  // Sort and filter logic
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCustomers = customers?.filter(c => 
    c.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aValue = a?.[orderBy];
    const bValue = b?.[orderBy];
    
    // Handle numeric sorting if needed
    if (orderBy === 'totalPoints') {
      const aPoints = calculateTotalPoints(getCustomerTransactions(a?.customerId));
      const bPoints = calculateTotalPoints(getCustomerTransactions(b?.customerId));
      return order === 'asc' ? aPoints - bPoints : bPoints - aPoints;
    }

    if (bValue < aValue) return order === 'asc' ? 1 : -1;
    if (bValue > aValue) return order === 'asc' ? -1 : 1;
    return 0;
  });

  const paginatedCustomers = sortedCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {/* Search Filter */}
      <Box sx={{ mb: 2 }}>
        <TextField
          id="customer-search"
          placeholder="Search by name, ID or email..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table aria-label="customer list table">
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell />
              {CUSTOMER_TABLE_COLUMNS.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.id === 'totalPoints' ? 'right' : col.id === 'actions' ? 'center' : 'left'}
                  sortDirection={orderBy === col.id ? order : false}
                >
                  {col.id !== 'actions' ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : 'asc'}
                      onClick={() => handleRequestSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((customer) => {
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
            {paginatedCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No customers found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

CustomerTable.propTypes = {
  customers: PropTypes.arrayOf(PropTypes.object).isRequired,
  transactionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewDetail: PropTypes.func.isRequired,
};

export default CustomerTable;
