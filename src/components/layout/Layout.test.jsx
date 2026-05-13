/**
 * Layout.test.jsx
 * Tests for the simplified Navbar layout.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

const mockUser = { name: 'Admin User' };

describe('Navbar Component', () => {
  test('renders navigation links and user info', () => {
    render(
      <BrowserRouter>
        <Navbar user={mockUser} onLogout={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Customers/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rewards/i })).toBeInTheDocument();
    expect(screen.getByText(/Admin User/i)).toBeInTheDocument();
  });

  test('calls logout when the button is clicked', () => {
    const onLogout = jest.fn();
    render(
      <BrowserRouter>
        <Navbar user={mockUser} onLogout={onLogout} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
    expect(onLogout).toHaveBeenCalled();
  });
});
