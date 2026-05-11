/**
 * mockApi.test.js
 * Unit tests for the mock API utility.
 */

import * as mockApi from './mockApi';
import logger from '../utils/logger';

jest.mock('../utils/logger');

// Mock global fetch
global.fetch = jest.fn();

describe('Mock API', () => {
  
  beforeEach(() => {
    fetch.mockClear();
    logger.apiCall.mockClear();
    logger.apiResponse.mockClear();
  });

  test('loginApi Positive: should login with correct credentials', async () => {
    const result = await mockApi.loginApi('admin', 'admin123');
    expect(result.user.username).toBe('admin');
    expect(result.token).toBeDefined();
  });

  test('loginApi Negative: should throw error for wrong credentials', async () => {
    await expect(mockApi.loginApi('wrong', 'pass')).rejects.toThrow();
  });

  test('fetchUsersApi Positive: should fetch users', async () => {
    const mockUsers = [{ id: 1, name: 'Test' }];
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsers
    });

    const result = await mockApi.fetchUsersApi();
    expect(result).toEqual(mockUsers);
  });

  test('fetchUsersApi Negative: should throw error on failed fetch', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404
    });

    await expect(mockApi.fetchUsersApi()).rejects.toThrow();
  });

  test('fetchCustomerTransactionsApi Positive: should fetch specific customer', async () => {
    const mockTxns = [{ customerId: 'C1', transactions: [] }];
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockTxns
    });

    const result = await mockApi.fetchCustomerTransactionsApi('C1');
    expect(result.customerId).toBe('C1');
  });

  test('fetchCustomerTransactionsApi Negative: should return null for missing customer', async () => {
    const mockTxns = [{ customerId: 'C1', transactions: [] }];
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockTxns
    });

    const result = await mockApi.fetchCustomerTransactionsApi('C99');
    expect(result).toBeNull();
  });
});
