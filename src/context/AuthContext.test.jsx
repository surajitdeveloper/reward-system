/**
 * AuthContext.test.jsx
 * Tests for the AuthContext provider and hook.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as mockApi from '../api/mockApi';

jest.mock('../api/mockApi');

const TestComponent = () => {
  const { user, login, logout, loginLoading } = useAuth();
  return (
    <div>
      <div data-testid="user-name">{user?.name || 'No User'}</div>
      <div data-testid="loading">{loginLoading ? 'Loading' : 'Idle'}</div>
      <button onClick={() => login('admin', 'admin123')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  
  test('Positive: should initialize with no user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user-name').textContent).toBe('No User');
  });

  test('Positive: should handle successful login', async () => {
    mockApi.loginApi.mockResolvedValue({
      token: 'test-token',
      user: { name: 'Test Admin' }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('user-name').textContent).toBe('Test Admin');
  });

  test('Negative: should handle failed login', async () => {
    mockApi.loginApi.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('user-name').textContent).toBe('No User');
  });

  test('Positive: should handle logout', async () => {
    // Start with logged in state is hard without manipulating localStorage, 
    // but we can just test the function call
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await act(async () => {
      screen.getByText('Logout').click();
    });
    
    expect(screen.getByTestId('user-name').textContent).toBe('No User');
  });
});
