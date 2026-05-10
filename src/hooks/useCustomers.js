/**
 * useCustomers.js
 * Custom hook to fetch and manage the customer list.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchUsersApi } from '../api/mockApi';
import logger from '../utils/logger';

/**
 * @returns {{
 *   customers: Array,
 *   loading: boolean,
 *   error: string|null,
 *   refetch: Function
 * }}
 */
const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    logger.info('useCustomers: fetching customer list');

    try {
      const data = await fetchUsersApi();
      setCustomers(data);
      logger.info(`useCustomers: loaded ${data.length} customers`);
    } catch (err) {
      logger.error('useCustomers error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { customers, loading, error, refetch: fetchCustomers };
};

export default useCustomers;
