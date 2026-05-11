/**
 * rewardCalculator.test.js
 * Unit tests for the reward calculation logic.
 * 
 * Logic:
 * - $0-$50: 0 pts
 * - $50-$100: 1 pt per dollar
 * - >$100: 2 pts per dollar (plus the 50 pts for the $50-$100 bracket)
 */

import { 
  calculatePointsForAmount, 
  enrichTransactionsWithPoints, 
  groupPointsByMonth, 
  calculateTotalPoints, 
  filterRecentMonths 
} from '../utils/rewardCalculator';

describe('Reward Calculation Logic', () => {
  
  // ─── Positive Test Cases ───

  test('PASS: should calculate 90 points for $120 spent (Whole Number)', () => {
    // 2 * (120-100) + 1 * (100-50) = 40 + 50 = 90
    expect(calculatePointsForAmount(120)).toBe(90);
  });

  test('PASS: should calculate 50 points for exactly $100 spent', () => {
    // 1 * (100-50) = 50
    expect(calculatePointsForAmount(100)).toBe(50);
  });

  test('PASS: should calculate points correctly for fractional values ($120.75)', () => {
    // Math.floor(120.75 - 100) * 2 + 50 = 20 * 2 + 50 = 90
    // The utility uses Math.floor on the excess amount
    expect(calculatePointsForAmount(120.75)).toBe(90);
  });

  // ─── Negative / Edge Test Cases ───

  test('FAIL (Logic Check): should return 0 points for spending less than $50 ($45)', () => {
    expect(calculatePointsForAmount(45)).toBe(0);
  });

  test('FAIL (Logic Check): should return 0 points for $0 spent', () => {
    expect(calculatePointsForAmount(0)).toBe(0);
  });

  test('FAIL (Type Check): should return 0 points for invalid inputs (null/string)', () => {
    expect(calculatePointsForAmount(null)).toBe(0);
    expect(calculatePointsForAmount('120')).toBe(0);
    expect(calculatePointsForAmount(undefined)).toBe(0);
    expect(calculatePointsForAmount(NaN)).toBe(0);
  });

  test('FAIL (Logic Check): should return 0 points for negative amounts', () => {
    expect(calculatePointsForAmount(-100)).toBe(0);
  });

  test('PASS: should calculate 1 point for $51 spent', () => {
    expect(calculatePointsForAmount(51)).toBe(1);
  });

  // ─── enrichTransactionsWithPoints ───
  describe('enrichTransactionsWithPoints', () => {
    test('Positive: should add points field to transaction objects', () => {
      const txns = [{ amount: 120 }, { amount: 50 }];
      const enriched = enrichTransactionsWithPoints(txns);
      expect(enriched[0].points).toBe(90);
      expect(enriched[1].points).toBe(0);
    });

    test('Negative: should handle null or empty transactions', () => {
      expect(enrichTransactionsWithPoints(null)).toEqual([]);
      expect(enrichTransactionsWithPoints([])).toEqual([]);
    });
  });

  // ─── groupPointsByMonth ───
  describe('groupPointsByMonth', () => {
    test('Positive: should group transactions by month', () => {
      const txns = [
        { date: '2025-01-15', points: 100 },
        { date: '2025-01-20', points: 50 },
        { date: '2025-02-10', points: 30 }
      ];
      const grouped = groupPointsByMonth(txns);
      expect(grouped['2025-01'].points).toBe(150);
      expect(grouped['2025-01'].transactions).toHaveLength(2);
      expect(grouped['2025-02'].points).toBe(30);
    });
  });

  // ─── calculateTotalPoints ───
  describe('calculateTotalPoints', () => {
    test('Positive: should sum up all points', () => {
      const txns = [{ points: 100 }, { points: 50 }];
      expect(calculateTotalPoints(txns)).toBe(150);
    });

    test('Negative: should return 0 for empty array', () => {
      expect(calculateTotalPoints([])).toBe(0);
    });
  });

  // ─── filterRecentMonths ───
  describe('filterRecentMonths', () => {
    test('Positive: should filter transactions to recent months', () => {
      const txns = [
        { date: '2025-03-01' }, // Latest
        { date: '2025-02-01' },
        { date: '2025-01-01' },
        { date: '2024-12-01' }
      ];
      const filtered = filterRecentMonths(txns, 3);
      // Latest is 2025-03. Cutoff is 2025-01-01.
      expect(filtered).toHaveLength(3);
    });

    test('Negative: should return empty array for empty input', () => {
      expect(filterRecentMonths([])).toEqual([]);
    });
  });
});
