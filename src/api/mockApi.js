/**
 * mockApi.js
 * Simulates asynchronous API calls using local JSON files.
 * Includes intentional delay to mimic real network latency.
 */

import {
  API_DELAY_MS,
  MOCK_ADMIN,
  ERROR_MESSAGES,
} from '../constants/appConstants';
import logger from '../utils/logger';

/**
 * Simulate a network delay.
 * @param {number} ms - Milliseconds to wait
 */
const simulateDelay = (ms = API_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic fetch helper with error handling.
 * @param {string} path - Path to the JSON file in /public
 * @returns {Promise<any>}
 */
const fetchJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Unable to fetch ${path}`);
  }
  return response.json();
};

// ─── Auth API ────────────────────────────────────────────────────────────────

/**
 * Mock login API.
 * Returns a resolved promise with a fake token on success,
 * or a rejected promise on invalid credentials.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ token: string, user: Object }>}
 */
export const loginApi = async (username, password) => {
  logger.apiCall('/api/auth/login', { username });
  await simulateDelay();

  if (
    username === MOCK_ADMIN.username &&
    password === MOCK_ADMIN.password
  ) {
    const result = {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        name: MOCK_ADMIN.name,
        role: MOCK_ADMIN.role,
        username: MOCK_ADMIN.username,
      },
    };
    logger.apiResponse('/api/auth/login', result);
    return result;
  }

  logger.warn('Login failed – invalid credentials for user:', username);
  throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
};

// ─── Users API ────────────────────────────────────────────────────────────────

/**
 * Mock API to fetch all customers/users.
 * @returns {Promise<Array>}
 */
export const fetchUsersApi = async () => {
  logger.apiCall('/api/users');
  await simulateDelay();

  try {
    const data = await fetchJson('/data/users.json');
    logger.apiResponse('/api/users', `Fetched ${data.length} users`);
    return data;
  } catch (err) {
    logger.error('fetchUsersApi failed:', err.message);
    throw new Error(ERROR_MESSAGES.FETCH_CUSTOMERS);
  }
};

// ─── Transactions API ─────────────────────────────────────────────────────────

/**
 * Mock API to fetch all transactions.
 * @returns {Promise<Array>}
 */
export const fetchTransactionsApi = async () => {
  logger.apiCall('/api/transactions');
  await simulateDelay();

  try {
    const data = await fetchJson('/data/transactions.json');
    logger.apiResponse('/api/transactions', `Fetched ${data.length} customer records`);
    return data;
  } catch (err) {
    logger.error('fetchTransactionsApi failed:', err.message);
    throw new Error(ERROR_MESSAGES.FETCH_TRANSACTIONS);
  }
};

/**
 * Mock API to fetch transactions for a specific customer.
 * @param {string} customerId
 * @returns {Promise<Object>} Customer transaction record
 */
export const fetchCustomerTransactionsApi = async (customerId) => {
  logger.apiCall(`/api/transactions/${customerId}`);
  await simulateDelay();

  try {
    const data = await fetchJson('/data/transactions.json');
    const customerData = data.find((c) => c.customerId === customerId);

    if (!customerData) {
      logger.warn(`No transactions found for customer: ${customerId}`);
      return null;
    }

    logger.apiResponse(`/api/transactions/${customerId}`, customerData);
    return customerData;
  } catch (err) {
    logger.error('fetchCustomerTransactionsApi failed:', err.message);
    throw new Error(ERROR_MESSAGES.FETCH_TRANSACTIONS);
  }
};
