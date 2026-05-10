/**
 * useTransactions.js
 * Custom hook to fetch all transactions and enrich them with reward points.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchTransactionsApi } from '../api/mockApi';
import { enrichTransactionsWithPoints } from '../utils/rewardCalculator';
import logger from '../utils/logger';

/**
 * @returns {{
 *   transactionData: Array,
 *   loading: boolean,
 *   error: string|null,
 *   refetch: Function
 * }}
 *
 * transactionData shape: [{ customerId, customerName, email, transactions: [...{transactionId, amount, date, points}] }]
 */
const useTransactions = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    logger.info('useTransactions: fetching transactions');

    try {
      const rawData = await fetchTransactionsApi();

      // Enrich each customer's transactions with calculated points
      const enriched = rawData.map((customer) => ({
        ...customer,
        transactions: enrichTransactionsWithPoints(customer.transactions),
      }));

      setTransactionData(enriched);
      logger.info(`useTransactions: enriched data for ${enriched.length} customers`);
    } catch (err) {
      logger.error('useTransactions error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactionData, loading, error, refetch: fetchTransactions };
};

export default useTransactions;
