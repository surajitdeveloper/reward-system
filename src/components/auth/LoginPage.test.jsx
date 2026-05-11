/**
 * LoginPage.test.jsx
 * Unit tests for the LoginPage component.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from './LoginPage';

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage Component', () => {
  
  test('Positive: should render the login form', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('Positive: should toggle password visibility', () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleBtn = screen.getByRole('button', { id: 'btn-toggle-password' });
    
    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');
  });

  test('Negative: should show validation errors for empty fields', async () => {
    renderLoginPage();
    const loginBtn = screen.getByRole('button', { name: /Sign In/i });
    
    fireEvent.click(loginBtn);
    
    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  test('Negative: should handle login interaction', async () => {
    renderLoginPage();
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(loginBtn);

    // Verify button goes to loading state or disables
    expect(loginBtn).toBeDisabled();
  });
});
