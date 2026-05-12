/**
 * RewardsPage.js
 * Page showing a high-level summary of rewards across all months.
 */

import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import useTransactions from '../hooks/useTransactions';
import { groupPointsByMonth } from '../utils/rewardCalculator';
import { getMonthLabel, sortYearMonths } from '../utils/dateUtils';

const RewardsPage = () => {
  const { transactionData, loading, error } = useTransactions();

  // Aggregate monthly data for all customers
  const globalMonthlyStats = useMemo(() => {
    if (!transactionData?.length) return {};

    const stats = {};
    transactionData?.forEach(customerData => {
      const monthlyData = groupPointsByMonth(customerData?.transactions);
      Object.keys(monthlyData).forEach(month => {
        if (!stats[month]) {
          stats[month] = { points: 0, transactions: 0, customers: new Set() };
        }
        stats[month].points += monthlyData[month]?.points || 0;
        stats[month].transactions += monthlyData[month]?.transactions?.length || 0;
        stats[month].customers.add(customerData?.customerId);
      });
    });

    return stats;
  }, [transactionData]);

  const months = sortYearMonths(Object.keys(globalMonthlyStats));

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Rewards Analytics
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' } }}>
          <Box>
            <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
              <Table aria-label="rewards summary table">
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="center">Total Transactions</TableCell>
                    <TableCell align="center">Active Customers</TableCell>
                    <TableCell align="right">Points Distributed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {months.map((month) => {
                    const data = globalMonthlyStats[month];
                    return (
                      <TableRow key={month} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{getMonthLabel(month)}</TableCell>
                        <TableCell align="center">{data?.transactions}</TableCell>
                        <TableCell align="center">{data?.customers?.size}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${data?.points?.toLocaleString()} pts`} 
                            color="secondary" 
                            variant="outlined" 
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {months.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No data available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>About the Program</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  The rewards program encourages customer loyalty by awarding points for every purchase.
                </Typography>
                <Typography variant="body2" component="div">
                  <ul>
                    <li>1 point per dollar spent between $50 and $100</li>
                    <li>2 points per dollar spent above $100</li>
                  </ul>
                </Typography>
                <Typography variant="body2">
                  Points are calculated per transaction and aggregated monthly.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RewardsPage;
