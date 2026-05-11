/**
 * DashboardPage.js
 * Overview dashboard showing summary stats and top customers.
 */

import React, { useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
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
  const { customers, loading: custLoading } = useCustomers();

  // Compute summary stats
  const stats = useMemo(() => {
    if (!transactionData.length) return null;

    let totalPoints = 0;
    let totalTxns   = 0;

    const customerPoints = transactionData?.map((cust) => {
      const pts = calculateTotalPoints(cust?.transactions);
      totalPoints += pts;
      totalTxns   += cust?.transactions?.length || 0;
      return { 
        name: cust?.customerName?.split(' ')[0] || 'Unknown', 
        points: pts, 
        customerId: cust?.customerId 
      };
    }) || [];

    // Top 8 by points for bar chart
    const top8 = [...customerPoints]
      .sort((a, b) => b.points - a.points)
      .slice(0, 8);

    return { totalPoints, totalTxns, top8 };
  }, [transactionData]);

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

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Dashboard Overview
      </Typography>

      {/* ── Stat Cards ── */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={customers?.length}
            icon={<PeopleIcon fontSize="large" />}
            color="#1565c0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Transactions"
            value={stats?.totalTxns ?? 0}
            icon={<ReceiptIcon fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Points Awarded"
            value={(stats?.totalPoints ?? 0).toLocaleString()}
            icon={<EmojiEventsIcon fontSize="large" />}
            color="#f57c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
        </Grid>
      </Grid>

      {/* ── Bar Chart: Top Customers by Points ── */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Top Customers by Reward Points
          </Typography>
          {stats?.top8?.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.top8} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val) => [`${val} pts`, 'Points']} />
                <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                  {stats.top8.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography color="text.secondary">No data available.</Typography>
          )}
        </CardContent>
      </Card>

      {/* ── Tier Summary ── */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Customer Tier Distribution
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['Platinum', 'Gold', 'Silver', 'Bronze'].map((tier) => {
              const count = customers?.filter((c) => c?.tier === tier)?.length || 0;
              const colorMap = { Platinum: '#1976d2', Gold: '#ffc107', Silver: '#9e9e9e', Bronze: '#cd7f32' };
              return (
                <Chip
                  key={tier}
                  label={`${tier}: ${count}`}
                  sx={{ bgcolor: colorMap[tier], color: tier === 'Gold' ? '#333' : '#fff', fontWeight: 600 }}
                />
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;
