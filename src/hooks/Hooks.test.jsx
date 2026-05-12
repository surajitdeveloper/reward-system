/**
 * Hooks.test.jsx
 * Tests for custom hooks useCustomers and useTransactions.
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import useCustomers from './useCustomers';
import useTransactions from './useTransactions';
import * as mockApi from '../api/mockApi';

jest.mock('../api/mockApi');

describe('Custom Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('useCustomers Positive: should fetch customers successfully', async () => {
    const mockData = [{ customerId: 'C1', customerName: 'John' }];
    mockApi.fetchUsersApi.mockResolvedValue(mockData);

    const { result } = renderHook(() => useCustomers());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.customers).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  test('useCustomers Positive: should refresh data when refetch is called', async () => {
    const initialData = [{ customerId: 'C1', customerName: 'John' }];
    const refreshedData = [{ customerId: 'C2', customerName: 'Jane' }];
    mockApi.fetchUsersApi.mockResolvedValueOnce(initialData).mockResolvedValueOnce(refreshedData);

    const { result } = renderHook(() => useCustomers());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.customers).toEqual(refreshedData));
  });

  test('useCustomers Negative: should handle fetch error', async () => {
    mockApi.fetchUsersApi.mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useCustomers());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Fetch failed');
    expect(result.current.customers).toEqual([]);
  });

  test('useTransactions Positive: should fetch transactions and enrich points', async () => {
    const mockData = [{ customerId: 'C1', transactions: [{ amount: 120, date: '2025-01-01' }] }];
    mockApi.fetchTransactionsApi.mockResolvedValue(mockData);

    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.transactionData[0].transactions[0].points).toBe(90);
    expect(result.current.error).toBeNull();
  });

  test('useTransactions Positive: should allow refetching after initial load', async () => {
    const firstData = [{ customerId: 'C1', transactions: [{ amount: 60, date: '2025-01-01' }] }];
    const secondData = [{ customerId: 'C2', transactions: [{ amount: 120, date: '2025-02-01' }] }];
    mockApi.fetchTransactionsApi.mockResolvedValueOnce(firstData).mockResolvedValueOnce(secondData);

    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.refetch();
    });
    await waitFor(() => expect(result.current.transactionData[0].customerId).toBe('C2'));
  });

  test('useTransactions Negative: should handle fetch error', async () => {
    mockApi.fetchTransactionsApi.mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Fetch failed');
    expect(result.current.transactionData).toEqual([]);
  });
});
