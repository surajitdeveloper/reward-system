/**
 * AuthContext.test.jsx
 * Tests for the AuthContext provider and hook.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { loginApi } from '../api/mockApi';

jest.mock('../api/mockApi');

const TestComponent = () => {
  const { user, login, logout, loginLoading, loginError } = useAuth();
  return (
    <div>
      <div data-testid="user-name">{user?.name || 'No User'}</div>
      <div data-testid="loading">{loginLoading ? 'Loading' : 'Idle'}</div>
      <div data-testid="login-error">{loginError}</div>
      <button onClick={() => login('admin', 'admin123')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Positive: should initialize with no user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-name').textContent).toBe('No User');
    expect(screen.getByTestId('loading').textContent).toBe('Idle');
  });

  test('Positive: should handle successful login', async () => {
    loginApi.mockResolvedValue({ token: 'test-token', user: { name: 'Test Admin' } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('user-name').textContent).toBe('Test Admin');
    expect(screen.getByTestId('login-error').textContent).toBe('');
  });

  test('Positive: should handle logout after login', async () => {
    loginApi.mockResolvedValue({ token: 'test-token', user: { name: 'Test Admin' } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('user-name').textContent).toBe('No User');
  });

  test('Negative: should handle failed login and preserve no user state', async () => {
    loginApi.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('user-name').textContent).toBe('No User');
    expect(screen.getByTestId('login-error').textContent).toBe('Invalid credentials');
  });

  test('Negative: should maintain idle state after logout with no active user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('user-name').textContent).toBe('No User');
    expect(screen.getByTestId('loading').textContent).toBe('Idle');
  });

  test('Negative: should clear loginError after a failed login followed by a successful login', async () => {
    loginApi.mockRejectedValueOnce(new Error('Invalid credentials')).mockResolvedValueOnce({ token: 'test-token', user: { name: 'Test Admin' } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('login-error').textContent).toBe('');
  });
});
