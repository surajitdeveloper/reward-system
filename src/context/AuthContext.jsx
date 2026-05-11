/**
 * AuthContext.js
 * Provides authentication state and actions across the app.
 * Persists login state to sessionStorage.
 */

import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loginApi } from '../api/mockApi';
import { AUTH_STORAGE_KEY } from '../constants/appConstants';
import logger from '../utils/logger';

// ─── Context Creation ─────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : { isAuthenticated: false, user: null, token: null };
    } catch {
      return { isAuthenticated: false, user: null, token: null };
    }
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Sync to sessionStorage when authState changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [authState]);

  /**
   * Attempt login with provided credentials.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>} true if successful
   */
  const login = useCallback(async (username, password) => {
    setLoginLoading(true);
    setLoginError('');
    logger.info('Attempting login for:', username);

    try {
      const { token, user } = await loginApi(username, password);
      setAuthState({ isAuthenticated: true, user, token });
      logger.info('Login successful:', user?.name);
      return true;
    } catch (err) {
      logger.warn('Login failed:', err.message);
      setLoginError(err.message);
      return false;
    } finally {
      setLoginLoading(false);
    }
  }, []);

  /**
   * Log the current user out.
   */
  const logout = useCallback(() => {
    logger.info('User logging out:', authState?.user?.name);
    setAuthState({ isAuthenticated: false, user: null, token: null });
  }, [authState.user]);

  const value = {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    token: authState.token,
    loginLoading,
    loginError,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ─── Custom Hook ─────────────────────────────────────────────────────────────
/**
 * useAuth – consume auth context from any child component.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};

export default AuthContext;
