/**
 * CustomersPage.js
 * Page displaying the customer list and handling the detail dialog state.
 */

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerDetailsDialog from '../components/customers/CustomerDetailsDialog';
import useCustomers from '../hooks/useCustomers';
import useTransactions from '../hooks/useTransactions';
import logger from '../utils/logger';

const CustomersPage = () => {
  const { customers, loading: custLoading, error: custError } = useCustomers();
  const { transactionData, loading: txnLoading, error: txnError } = useTransactions();
  
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetail = (customerId) => {
    logger.info('Opening details for customer:', customerId);
    setSelectedCustomerId(customerId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const loading = custLoading || txnLoading;
  const error = custError || txnError;

  const selectedCustomer = customers?.find(c => c.customerId === selectedCustomerId);
  const selectedTransactions = transactionData?.find(c => c.customerId === selectedCustomerId)?.transactions || [];

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link underline="hover" color="inherit" href="/">
          Dashboard
        </Link>
        <Typography color="text.primary">Customers</Typography>
      </Breadcrumbs>

      <Typography variant="h5" fontWeight={700} mb={1}>
        Customer Management
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={3}>
        View and manage customer reward profiles and transaction history.
      </Typography>

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
          customers={customers} 
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
