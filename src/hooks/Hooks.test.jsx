/**
 * Hooks.test.jsx
 * Tests for custom hooks useCustomers and useTransactions.
 */

import { renderHook, waitFor } from '@testing-library/react';
import useCustomers from './useCustomers';
import useTransactions from './useTransactions';
import * as mockApi from '../api/mockApi';

jest.mock('../api/mockApi');

describe('Custom Hooks', () => {
  
  test('useCustomers Positive: should fetch customers successfully', async () => {
    const mockData = [{ customerId: 'C1', name: 'John' }];
    mockApi.fetchUsersApi.mockResolvedValue(mockData);

    const { result } = renderHook(() => useCustomers());

    expect(result.current.loading).toBe(true);
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.customers).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  test('useCustomers Negative: should handle fetch error', async () => {
    mockApi.fetchUsersApi.mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useCustomers());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Fetch failed');
  });

  test('useTransactions Positive: should fetch transactions successfully', async () => {
    const mockData = [{ customerId: 'C1', transactions: [] }];
    mockApi.fetchTransactionsApi.mockResolvedValue(mockData);

    const { result } = renderHook(() => useTransactions());

    expect(result.current.loading).toBe(true);
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.transactionData).toHaveLength(1);
  });
});
