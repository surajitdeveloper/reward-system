/**
 * DashboardPage.js
 * Overview dashboard showing summary stats and top customers.
 */

import React, { useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import useTransactions from '../hooks/useTransactions';
import useCustomers from '../hooks/useCustomers';
import { calculateTotalPoints } from '../utils/rewardCalculator';
import { CHART_COLORS } from '../constants/appConstants';

// ─── Stat Card Sub-component ───────────────────────────────────────────────────
const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h4" fontWeight={700} color={color} mt={0.5}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ color, opacity: 0.8 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { transactionData, loading: txnLoading, error: txnError } = useTransactions();
  const { customers, loading: custLoading, error: custError } = useCustomers();
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Compute summary stats
  const stats = useMemo(() => {
    if (!transactionData || !transactionData.length) return null;

    let totalPoints = 0;
    let totalTxns = 0;
    let totalRevenue = 0;

    const customerPoints = transactionData.map((cust) => {
      const pts = calculateTotalPoints(cust?.transactions);
      totalPoints += pts;
      totalTxns += cust?.transactions?.length || 0;
      totalRevenue += cust?.transactions?.reduce((sum, txn) => sum + (txn?.amount || 0), 0);

      return {
        name: cust?.customerName?.split(' ')[0] || 'Unknown',
        points: pts,
        customerId: cust?.customerId,
      };
    });

    // Top 8 by points for bar chart
    const top8 = [...customerPoints]
      .sort((a, b) => b.points - a.points)
      .slice(0, 8);

    const avgTransactionValue = totalTxns ? totalRevenue / totalTxns : 0;
    const topCustomer = top8[0] || null;

    return {
      totalPoints,
      totalTxns,
      totalRevenue,
      avgTransactionValue,
      top8,
      customerPoints,
      topCustomer,
    };
  }, [transactionData]);

  const selectedCustomerDetail = useMemo(() => {
    if (!selectedCustomerId || !transactionData?.length) return null;

    const customerRecord = transactionData.find((customer) => customer.customerId === selectedCustomerId);
    if (!customerRecord) return null;

    const customerProfile = customers.find((customer) => customer.customerId === selectedCustomerId) || {};
    const totalSpend = customerRecord.transactions.reduce((sum, txn) => sum + (txn?.amount || 0), 0);
    const points = calculateTotalPoints(customerRecord.transactions);
    const averageSpend = customerRecord.transactions.length ? totalSpend / customerRecord.transactions.length : 0;
    const recentTransactions = [...customerRecord.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return {
      ...customerRecord,
      email: customerProfile.email || customerRecord.email,
      totalSpend,
      averageSpend,
      points,
      recentTransactions,
    };
  }, [selectedCustomerId, transactionData, customers]);

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
  };

  const loading = txnLoading || custLoading;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (txnError) {
    return <Alert severity="error" sx={{ mt: 2 }}>{txnError}</Alert>;
  }

  if (custError) {
    return <Alert severity="error" sx={{ mt: 2 }}>{custError}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Dashboard Overview
      </Typography>

      {/* ── Stat Cards ── */}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, minmax(0, 1fr))' } }} mb={4}>
        <Box>
          <StatCard
            title="Total Customers"
            value={customers?.length}
            icon={<PeopleIcon fontSize="large" />}
            color="#1565c0"
          />
        </Box>
        <Box>
          <StatCard
            title="Total Transactions"
            value={stats?.totalTxns ?? 0}
            icon={<ReceiptIcon fontSize="large" />}
            color="#2e7d32"
          />
        </Box>
        <Box>
          <StatCard
            title="Total Points Awarded"
            value={(stats?.totalPoints ?? 0).toLocaleString()}
            icon={<EmojiEventsIcon fontSize="large" />}
            color="#f57c00"
          />
        </Box>
        <Box>
          <StatCard
            title="Avg Points / Customer"
            value={
              customers?.length
                ? Math.round((stats?.totalPoints ?? 0) / customers?.length).toLocaleString()
                : 0
            }
            icon={<TrendingUpIcon fontSize="large" />}
            color="#7b1fa2"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }} mb={4}>
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<ReceiptIcon fontSize="large" />}
          color="#0f4c81"
        />
        <StatCard
          title="Top Customer"
          value={stats?.topCustomer?.name || 'N/A'}
          icon={<PeopleIcon fontSize="large" />}
          color="#f57c00"
        />
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Top Customers by Reward Points
            </Typography>
            {stats?.top8?.length ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.top8} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(val) => [`${val} pts`, 'Points']} />
                    <Bar
                      dataKey="points"
                      radius={[4, 4, 0, 0]}
                      onClick={(data) => handleSelectCustomer(data?.customerId)}
                      cursor="pointer"
                    >
                      {stats.top8.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={1}>
                    Click a customer to view their details
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    {stats.top8.map((customer) => (
                      <Button
                        key={customer.customerId}
                        variant={customer.customerId === selectedCustomerId ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => handleSelectCustomer(customer.customerId)}
                        sx={{
                          justifyContent: 'space-between',
                          textTransform: 'none',
                          py: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body2" color="text.primary">
                          {customer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {customer.points.toLocaleString()} pts
                        </Typography>
                      </Button>
                    ))}
                  </Box>
                </Box>
              </>
            ) : (
              <Typography color="text.secondary">No data available.</Typography>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Customer Details
            </Typography>
            {selectedCustomerDetail ? (
              <>
                <Box sx={{ display: 'grid', gap: 1, mb: 3 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {selectedCustomerDetail.customerName}
                  </Typography>
                  <Typography color="text.secondary">{selectedCustomerDetail.email}</Typography>
                  <Typography color="text.secondary">
                    {selectedCustomerDetail.transactions.length} transactions •
                    {' '}${selectedCustomerDetail.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} spent
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gap: 1, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Points
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {selectedCustomerDetail.points.toLocaleString()} pts
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Avg. Transaction
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      ${selectedCustomerDetail.averageSpend.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Most Recent Purchase
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {selectedCustomerDetail.recentTransactions[0]?.date || 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  Recent Transactions
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Points</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedCustomerDetail.recentTransactions.map((txn) => (
                        <TableRow key={txn.transactionId}>
                          <TableCell>{txn.date}</TableCell>
                          <TableCell>${txn.amount.toFixed(2)}</TableCell>
                          <TableCell>{txn.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Typography color="text.secondary">
                Click a bar or customer from the list to see transaction and point details.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;
