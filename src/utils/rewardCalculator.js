/**
 * rewardCalculator.js
 * Pure utility functions for reward point calculations.
 *
 * Rules:
 *  - 2 points per $1 spent OVER $100 in a single transaction
 *  - 1 point per $1 spent between $50 and $100 in a single transaction
 *
 * Example: $120 purchase = 2×$20 + 1×$50 = 90 points
 */

import { REWARD_THRESHOLDS } from '../constants/appConstants';

/**
 * Calculate reward points for a single transaction amount.
 * Handles whole numbers and fractional dollar values (floor math).
 *
 * @param {number} amount - Transaction amount in dollars
 * @returns {number} Points earned (integer)
 */
export const calculatePointsForAmount = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return 0;
  }

  let points = 0;

  if (amount > REWARD_THRESHOLDS.TIER2_MIN) {
    // Points for portion above $100 (2 pts per dollar)
    const above100 = Math.floor(amount - REWARD_THRESHOLDS.TIER2_MIN);
    points += above100 * 2;

    // Points for portion between $50 and $100 (1 pt per dollar)
    const tier1Range = REWARD_THRESHOLDS.TIER2_MIN - REWARD_THRESHOLDS.TIER1_MIN; // $50
    points += tier1Range * 1;
  } else if (amount > REWARD_THRESHOLDS.TIER1_MIN) {
    // Points for portion between $50 and $100
    const tier1 = Math.floor(amount - REWARD_THRESHOLDS.TIER1_MIN);
    points += tier1 * 1;
  }

  return points;
};

/**
 * Add points metadata to each transaction in an array.
 *
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Transactions with `points` field added
 */
export const enrichTransactionsWithPoints = (transactions = []) => {
  return transactions.map((txn) => ({
    ...txn,
    points: calculatePointsForAmount(txn.amount),
  }));
};

/**
 * Group transactions by year-month and sum points per month.
 *
 * @param {Array} transactions - Enriched transactions (with `points`)
 * @returns {Object} { "2025-01": { points: 150, transactions: [...] }, ... }
 */
export const groupPointsByMonth = (transactions = []) => {
  return transactions.reduce((acc, txn) => {
    const dateObj = new Date(txn.date);
    const yearMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

    if (!acc[yearMonth]) {
      acc[yearMonth] = { points: 0, transactions: [] };
    }
    acc[yearMonth].points += txn.points;
    acc[yearMonth].transactions.push(txn);
    return acc;
  }, {});
};

/**
 * Calculate total reward points across all transactions.
 *
 * @param {Array} transactions - Enriched transactions
 * @returns {number} Total points
 */
export const calculateTotalPoints = (transactions = []) => {
  return transactions.reduce((sum, txn) => sum + (txn.points || 0), 0);
};

/**
 * Filter transactions to the most recent N months.
 *
 * @param {Array} transactions - Enriched transactions
 * @param {number} monthCount - Number of recent months to include
 * @returns {Array} Filtered transactions
 */
export const filterRecentMonths = (transactions = [], monthCount = 3) => {
  if (!transactions.length) return [];

  // Find the latest date in the dataset
  const dates = transactions.map((t) => new Date(t.date).getTime());
  const latestDate = new Date(Math.max(...dates));

  // Calculate cutoff date
  const cutoff = new Date(latestDate);
  cutoff.setMonth(cutoff.getMonth() - (monthCount - 1));
  cutoff.setDate(1); // Start of that month
  cutoff.setHours(0, 0, 0, 0);

  return transactions.filter((txn) => new Date(txn.date) >= cutoff);
};
