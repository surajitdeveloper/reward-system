/**
 * appConstants.js
 * Central file for all static/constant data.
 * No hardcoded values in components — import from here instead.
 */

// ─── Route Paths ─────────────────────────────────────────────────────────────
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:customerId',
  REWARDS: '/rewards',
};

// ─── Mock Admin Credentials ───────────────────────────────────────────────────
export const MOCK_ADMIN = {
  username: 'admin',
  password: 'admin123',
  name: 'Admin User',
  role: 'Administrator',
};

// ─── Simulated API Delay (ms) ─────────────────────────────────────────────────
export const API_DELAY_MS = 800;

// ─── Reward Point Thresholds ──────────────────────────────────────────────────
export const REWARD_THRESHOLDS = {
  TIER1_MIN: 50,   // 1 point per $1 above $50
  TIER2_MIN: 100,  // 2 points per $1 above $100
};

// ─── Month Names ──────────────────────────────────────────────────────────────
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ─── Customer Tier Config ─────────────────────────────────────────────────────
export const CUSTOMER_TIERS = {
  Bronze: { color: '#cd7f32', label: 'Bronze' },
  Silver: { color: '#9e9e9e', label: 'Silver' },
  Gold:   { color: '#ffc107', label: 'Gold' },
  Platinum: { color: '#1976d2', label: 'Platinum' },
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_ROWS_PER_PAGE = 10;
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

// ─── Table Column Labels ──────────────────────────────────────────────────────
export const CUSTOMER_TABLE_COLUMNS = [
  { id: 'customerId',    label: 'Customer ID' },
  { id: 'customerName',  label: 'Name' },
  { id: 'email',         label: 'Email' },
  { id: 'tier',          label: 'Tier' },
  { id: 'totalPoints',   label: 'Total Points' },
  { id: 'actions',       label: 'Actions' },
];

// ─── Transaction Table Column Labels ─────────────────────────────────────────
export const TRANSACTION_TABLE_COLUMNS = [
  { id: 'transactionId', label: 'Transaction ID' },
  { id: 'date',          label: 'Date' },
  { id: 'amount',        label: 'Amount ($)' },
  { id: 'points',        label: 'Points Earned' },
];

// ─── App Title ─────────────────────────────────────────────────────────────────
export const APP_TITLE = 'Rewards Management System';
export const APP_SUBTITLE = 'Track & Manage Customer Reward Points';

// ─── Auth Storage Key ──────────────────────────────────────────────────────────
export const AUTH_STORAGE_KEY = 'rewardSystemAuth';

// ─── Error Messages ───────────────────────────────────────────────────────────
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password.',
  FETCH_CUSTOMERS: 'Failed to load customer data. Please try again.',
  FETCH_TRANSACTIONS: 'Failed to load transactions. Please try again.',
  GENERIC: 'Something went wrong. Please try again.',
};

// ─── Success Messages ─────────────────────────────────────────────────────────
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful! Welcome back.',
  LOGOUT: 'You have been logged out.',
};

// ─── No Data Label ────────────────────────────────────────────────────────────
export const NO_TRANSACTIONS_LABEL = 'No transactions found.';

// ─── Chart Colors ─────────────────────────────────────────────────────────────
export const CHART_COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f'];

// ─── Recent Months to Display by Default ─────────────────────────────────────
export const DEFAULT_RECENT_MONTHS = 3;
