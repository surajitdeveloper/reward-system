/**
 * CustomerDetailsDialog.js
 * Full-screen or large dialog showing detailed reward breakdown for a selected customer.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import { 
  calculateTotalPoints, 
  groupPointsByMonth, 
  filterRecentMonths 
} from '../../utils/rewardCalculator';
import { formatDate, getMonthLabel, sortYearMonths } from '../../utils/dateUtils';
import { NO_TRANSACTIONS_LABEL, DEFAULT_RECENT_MONTHS } from '../../constants/appConstants';

const CustomerDetailsDialog = ({ open, customer, transactions, onClose }) => {
  // Process data for display
  const processedData = useMemo(() => {
    if (!customer || !transactions || transactions.length === 0) return null;

    // By default, filter to recent 3 months as per requirement
    const recentTxns = filterRecentMonths(transactions, DEFAULT_RECENT_MONTHS);
    const monthlyGroups = groupPointsByMonth(recentTxns);
    const months = sortYearMonths(Object.keys(monthlyGroups));
    const totalPoints = calculateTotalPoints(recentTxns);

    return { months, monthlyGroups, totalPoints, recentTxns };
  }, [customer, transactions]);

  if (!customer) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
      id={`dialog-customer-${customer?.customerId}`}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#1565c0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600}>
          Customer Details & Rewards Breakdown
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* ── Customer Info Card ── */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="overline" color="textSecondary">Customer Profile</Typography>
                <Typography variant="h5" fontWeight={700} gutterBottom>{customer?.customerName}</Typography>
                <Typography variant="body2" color="textSecondary">ID: {customer?.customerId}</Typography>
                <Typography variant="body2" color="textSecondary">Email: {customer?.email}</Typography>
                <Box mt={2}>
                  <Chip label={customer?.tier} color="primary" variant="outlined" size="small" />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" fontWeight={600}>Total Points (Last {DEFAULT_RECENT_MONTHS} Months)</Typography>
                <Typography variant="h3" color="primary.main" fontWeight={800}>
                  {processedData ? processedData?.totalPoints : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* ── Monthly Summary ── */}
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Reward Points by Month</Typography>
            {processedData ? (
              <Grid container spacing={2}>
                {processedData?.months?.map(month => (
                  <Grid item xs={12} sm={4} key={month}>
                    <Card sx={{ bgcolor: '#e3f2fd' }}>
                      <CardContent sx={{ textAlign: 'center', py: 1 }}>
                        <Typography variant="caption" color="textSecondary">{getMonthLabel(month)}</Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {processedData?.monthlyGroups?.[month]?.points}
                        </Typography>
                        <Typography variant="caption">pts</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="textSecondary">{NO_TRANSACTIONS_LABEL}</Typography>
            )}
          </Grid>

          {/* ── Detailed Transaction Table ── */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Recent Transactions Details</Typography>
            {processedData ? (
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Txn ID</TableCell>
                      <TableCell align="right">Amount ($)</TableCell>
                      <TableCell align="right">Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processedData?.recentTxns?.map((txn) => (
                      <TableRow key={txn?.transactionId} hover>
                        <TableCell>{formatDate(txn?.date)}</TableCell>
                        <TableCell>{txn?.transactionId}</TableCell>
                        <TableCell align="right">${txn?.amount?.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <Chip label={txn?.points} size="small" color="primary" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              <Typography color="textSecondary">No detailed transaction data available.</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CustomerDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  customer: PropTypes.object,
  transactions: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
};

export default CustomerDetailsDialog;
