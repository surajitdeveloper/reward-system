/**
 * CustomerRow.jsx
 * Simple row for a single customer entry.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TransactionRow from './TransactionRow';
import { CUSTOMER_TIERS } from '../../constants/appConstants';

const CustomerRow = ({ customer, transactions, totalPoints, onViewDetail }) => {
  const [open, setOpen] = useState(false);
  const tierConfig = CUSTOMER_TIERS[customer?.tier] || CUSTOMER_TIERS.Bronze;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width="50">
          <IconButton
            size="small"
            aria-label="toggle transaction details"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{customer.customerId}</TableCell>
        <TableCell>{customer.customerName}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>
          <Chip label={customer.tier} size="small" sx={{ bgcolor: tierConfig.color, color: '#fff' }} />
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
          {totalPoints.toLocaleString()}
        </TableCell>
        <TableCell align="center">
          <IconButton
            id={`view-btn-${customer.customerId}`}
            aria-label={`view details for ${customer.customerName}`}
            color="primary"
            onClick={() => onViewDetail(customer.customerId)}
          >
            <VisibilityIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Recent Transactions
              </Typography>
              {transactions && transactions.length > 0 ? (
                <Table size="small" aria-label="transaction details">
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
                          <Typography variant="body2" color="text.secondary">
                            Showing 5 of {transactions.length} transactions. Use details for full history.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent transactions available.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

CustomerRow.propTypes = {
  customer: PropTypes.shape({
    customerId: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
  }).isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalPoints: PropTypes.number.isRequired,
  onViewDetail: PropTypes.func.isRequired,
};

export default CustomerRow;
