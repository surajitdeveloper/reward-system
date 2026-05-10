/**
 * dateUtils.js
 * Utility functions for date formatting and manipulation.
 */

import { MONTH_NAMES } from '../constants/appConstants';

/**
 * Format a date string to a human-readable format.
 * @param {string} dateString - ISO date string e.g. "2025-01-15"
 * @returns {string} e.g. "Jan 15, 2025"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get a "YYYY-MM" string from a date string.
 * @param {string} dateString
 * @returns {string} "2025-01"
 */
export const getYearMonth = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Get full month name from "YYYY-MM" string.
 * @param {string} yearMonth - "2025-01"
 * @returns {string} "January 2025"
 */
export const getMonthLabel = (yearMonth) => {
  if (!yearMonth) return '';
  const [year, monthIndex] = yearMonth.split('-');
  return `${MONTH_NAMES[parseInt(monthIndex, 10) - 1]} ${year}`;
};

/**
 * Sort year-month keys chronologically.
 * @param {string[]} yearMonths
 * @returns {string[]}
 */
export const sortYearMonths = (yearMonths) => {
  return [...yearMonths].sort((a, b) => (a > b ? 1 : -1));
};
