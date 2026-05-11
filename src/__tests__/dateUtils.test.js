/**
 * dateUtils.test.js
 * Unit tests for date utilities.
 */

import { formatDate, getYearMonth, getMonthLabel, sortYearMonths } from '../utils/dateUtils';

describe('Date Utilities', () => {
  
  // ─── Positive Cases ───

  test('Positive: should format date correctly', () => {
    // Note: locale string might vary by environment, so we check if it contains expected parts
    const formatted = formatDate('2025-01-15');
    expect(formatted).toContain('2025');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
  });

  test('Positive: should get year-month string', () => {
    expect(getYearMonth('2025-01-15')).toBe('2025-01');
  });

  test('Positive: should get month label', () => {
    expect(getMonthLabel('2025-01')).toBe('January 2025');
  });

  test('Positive: should sort year-month strings', () => {
    const input = ['2025-02', '2025-01', '2024-12'];
    expect(sortYearMonths(input)).toEqual(['2024-12', '2025-01', '2025-02']);
  });

  // ─── Negative Cases ───

  test('Negative: should return empty string for null/undefined date', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  test('Negative: should return "Invalid Date" for bad date string', () => {
    expect(formatDate('not-a-date')).toBe('Invalid Date');
  });

  test('Negative: should return empty string for year-month of invalid date', () => {
    expect(getYearMonth('invalid')).toBe('');
  });

  test('Negative: should handle empty yearMonth in label', () => {
    expect(getMonthLabel('')).toBe('');
    expect(getMonthLabel(null)).toBe('');
  });
});
