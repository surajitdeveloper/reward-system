/**
 * logger.test.js
 * Unit tests for the logger utility.
 */

import logger from '../utils/logger';

describe('Logger Utility', () => {
  let spyInfo, spyWarn, spyError, spyDebug, spyGroup, spyGroupEnd;

  beforeEach(() => {
    spyInfo = jest.spyOn(console, 'info').mockImplementation(() => {});
    spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    spyError = jest.spyOn(console, 'error').mockImplementation(() => {});
    spyDebug = jest.spyOn(console, 'debug').mockImplementation(() => {});
    spyGroup = jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    spyGroupEnd = jest.spyOn(console, 'groupEnd').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Positive: should log info messages', () => {
    logger.info('test info');
    expect(spyInfo).toHaveBeenCalled();
    expect(spyInfo.mock.calls[0][0]).toContain('[INFO]');
  });

  test('Positive: should log warn messages', () => {
    logger.warn('test warn');
    expect(spyWarn).toHaveBeenCalled();
  });

  test('Positive: should log error messages', () => {
    logger.error('test error');
    expect(spyError).toHaveBeenCalled();
  });

  test('Positive: should log API calls', () => {
    logger.apiCall('/test-endpoint', { id: 1 });
    expect(spyGroup).toHaveBeenCalled();
    expect(spyDebug).toHaveBeenCalled();
  });

  test('Positive: should log API responses', () => {
    logger.apiResponse('/test-endpoint', { success: true });
    expect(spyGroup).toHaveBeenCalled();
  });

  test('Negative: should handle logging without arguments', () => {
    logger.info();
    expect(spyInfo).toHaveBeenCalled();
  });
});
