/**
 * MainLayout.jsx
 * Simple authenticated page layout with top navigation and content area.
 */

import React from 'react';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

const MainLayout = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#eef2f7' }}>
      <Navbar user={user} onLogout={logout} />
      <Box
        component="main"
        sx={{
          mt: 10,
          px: { xs: 2, md: 3 },
          pb: 4,
          maxWidth: 1280,
          mx: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};


export default MainLayout;
