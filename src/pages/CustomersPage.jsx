/**
 * CustomersPage.js
 * Page displaying the customer list and handling the detail dialog state.
 */

import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerDetailsDialog from '../components/customers/CustomerDetailsDialog';
import useCustomers from '../hooks/useCustomers';
import useTransactions from '../hooks/useTransactions';
import { CUSTOMER_TIERS } from '../constants/appConstants';

const CustomersPage = () => {
  const { customers, loading: custLoading, error: custError } = useCustomers();
  const { transactionData, loading: txnLoading, error: txnError } = useTransactions();
  
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const filteredCustomers = useMemo(() => {
    if (!selectedTier) return customers;
    return customers.filter((customer) => customer.tier === selectedTier);
  }, [customers, selectedTier]);

  const tierOptions = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'];

  const handleViewDetail = (customerId) => {
    setSelectedCustomerId(customerId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleTierSelect = (tier) => {
    setSelectedTier((prev) => (prev === tier ? null : tier));
  };

  const loading = custLoading || txnLoading;
  const error = custError || txnError;

  const selectedCustomer = customers?.find((c) => c.customerId === selectedCustomerId);
  const selectedTransactions = transactionData?.find((c) => c.customerId === selectedCustomerId)?.transactions || [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Customer Management
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={3}>
        View and manage customer reward profiles and transaction history.
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {tierOptions.map((tier) => {
          const tierColor = tier === 'All' ? '#1976d2' : CUSTOMER_TIERS[tier]?.color;
          const isSelected = selectedTier === tier || (tier === 'All' && !selectedTier);
          const count = tier === 'All'
            ? customers?.length ?? 0
            : customers?.filter((customer) => customer.tier === tier).length || 0;

          return (
            <Chip
              key={tier}
              label={`${tier} (${count})`}
              clickable
              variant={isSelected ? 'filled' : 'outlined'}
              onClick={() => handleTierSelect(tier === 'All' ? null : tier)}
              sx={{
                fontWeight: 600,
                bgcolor: isSelected ? tierColor : undefined,
                color: isSelected ? '#fff' : tierColor,
                borderColor: tierColor,
              }}
            />
          );
        })}
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <CustomerTable 
          customers={filteredCustomers} 
          transactionData={transactionData} 
          onViewDetail={handleViewDetail} 
        />
      )}

      {/* Detail Dialog */}
      <CustomerDetailsDialog
        open={dialogOpen}
        customer={selectedCustomer}
        transactions={selectedTransactions}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default CustomersPage;
