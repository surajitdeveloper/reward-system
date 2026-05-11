/**
 * Layout.test.jsx
 * Tests for Sidebar and Navbar.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const mockUser = { name: 'Admin User' };

describe('Layout Components', () => {
  
  test('Sidebar Positive: should render navigation links', () => {
    render(
      <BrowserRouter>
        <Sidebar open={true} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Customers/i)).toBeInTheDocument();
  });

  test('Navbar Positive: should render user name', () => {
    render(
      <BrowserRouter>
        <Navbar user={mockUser} onLogout={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Admin User/i)).toBeInTheDocument();
  });

  test('Navbar Negative: should handle logout click', () => {
    const onLogout = jest.fn();
    render(
      <BrowserRouter>
        <Navbar user={mockUser} onLogout={onLogout} />
      </BrowserRouter>
    );
    const logoutBtn = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();
  });
});
