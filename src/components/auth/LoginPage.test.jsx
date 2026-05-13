/**
 * LoginPage.test.jsx
 * Unit tests for the LoginPage component.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from './LoginPage';
import { loginApi } from '../../api/mockApi';

jest.mock('../../api/mockApi', () => ({
  loginApi: jest.fn(),
}));

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('LoginPage Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    loginApi.mockClear();
  });

  test('Positive: should render the login form', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('Positive: should toggle password visibility', () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
    const toggleBtn = screen.getByLabelText(/toggle password visibility/i);

    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');
  });

  test('Positive: should navigate on successful login', async () => {
    loginApi.mockResolvedValue({ token: 'token', user: { name: 'Admin', username: 'admin' } });
    renderLoginPage();

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Password/i, { selector: 'input' }), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/'));
  });

  test('Negative: should show validation errors for empty fields', async () => {
    renderLoginPage();

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  test('Negative: should display invalid credentials error on login failure', async () => {
    loginApi.mockRejectedValue(new Error('Invalid username or password.'));
    renderLoginPage();

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/Password/i, { selector: 'input' }), { target: { value: 'badpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/Invalid username or password/i);
  });

  test('Negative: should keep Sign In enabled after validation fails', async () => {
    renderLoginPage();

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await screen.findByText(/Username is required/i);

    expect(screen.getByRole('button', { name: /Sign In/i })).not.toBeDisabled();
  });
});
