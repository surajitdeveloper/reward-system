/**
 * logger.js
 * Custom logger utility. Uses console under the hood with level-based filtering.
 * Import and use logger.info / logger.warn / logger.error / logger.debug
 * throughout the app instead of direct console calls.
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Change this to control verbosity (DEBUG shows everything)
const CURRENT_LEVEL = LOG_LEVELS.DEBUG;

const PREFIX = '[RewardSystem]';

const formatMessage = (level, message, ...args) =>
  [`${PREFIX} [${level}]`, message, ...args];

const logger = {
  /**
   * Debug log – lowest severity, for development tracing.
   */
  debug: (message, ...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
      console.debug(...formatMessage('DEBUG', message, ...args));
    }
  },

  /**
   * Info log – general informational messages.
   */
  info: (message, ...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
      console.info(...formatMessage('INFO', message, ...args));
    }
  },

  /**
   * Warn log – potential issues that aren't errors yet.
   */
  warn: (message, ...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(...formatMessage('WARN', message, ...args));
    }
  },

  /**
   * Error log – serious problems.
   */
  error: (message, ...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
      console.error(...formatMessage('ERROR', message, ...args));
    }
  },

  /**
   * Log API call metadata.
   */
  apiCall: (endpoint, payload = null) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
      console.groupCollapsed(`${PREFIX} [API] → ${endpoint}`);
      if (payload) console.debug('Payload:', payload);
      console.debug('Timestamp:', new Date().toISOString());
      console.groupEnd();
    }
  },

  /**
   * Log API response metadata.
   */
  apiResponse: (endpoint, data) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
      console.groupCollapsed(`${PREFIX} [API] ← ${endpoint}`);
      console.debug('Response:', data);
      console.debug('Timestamp:', new Date().toISOString());
      console.groupEnd();
    }
  },
};

export default logger;
