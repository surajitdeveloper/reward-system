/**
 * CustomerRow.js
 * A single customer row for the main customer list table.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Chip from '@mui/material/Chip';
import TransactionRow from './TransactionRow';
import { CUSTOMER_TIERS } from '../../constants/appConstants';

const CustomerRow = ({ customer, transactions, totalPoints, onViewDetail }) => {
  const [open, setOpen] = useState(false);
  const tierConfig = CUSTOMER_TIERS[customer?.tier] || CUSTOMER_TIERS.Bronze;

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width="50">
          <IconButton
            id={`expand-btn-${customer?.customerId}`}
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {customer?.customerId}
        </TableCell>
        <TableCell>{customer?.customerName}</TableCell>
        <TableCell>{customer?.email}</TableCell>
        <TableCell>
          <Chip 
            label={customer?.tier} 
            size="small" 
            sx={{ bgcolor: tierConfig?.color, color: '#fff' }} 
          />
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
          {totalPoints?.toLocaleString()}
        </TableCell>
        <TableCell align="center">
          <IconButton 
            id={`view-btn-${customer?.customerId}`}
            color="primary" 
            onClick={() => onViewDetail(customer?.customerId)}
          >
            <VisibilityIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      
      {/* Collapsible section for transactions summary */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Recent Transactions
              </Typography>
              {transactions && transactions.length > 0 ? (
                <Table size="small" aria-label="transactions">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.slice(0, 5).map((txn) => (
                      <TransactionRow key={txn.transactionId} transaction={txn} />
                    ))}
                    {transactions.length > 5 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="textSecondary">
                            ... and {transactions.length - 5} more transactions. Click view for full details.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No transactions found for this customer.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

CustomerRow.propTypes = {
  customer: PropTypes.shape({
    customerId: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
  }).isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object),
  totalPoints: PropTypes.number.isRequired,
  onViewDetail: PropTypes.func.isRequired,
};

export default CustomerRow;
