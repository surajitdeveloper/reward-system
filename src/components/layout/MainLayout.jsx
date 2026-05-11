/**
 * MainLayout.js
 * Main layout wrapping authenticated pages with Navbar + Sidebar.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top AppBar */}
      <Box sx={{ position: 'relative' }}>
        <Navbar user={user} onLogout={logout} />
        {/* Hamburger toggle for sidebar */}
        <IconButton
          id="btn-toggle-sidebar"
          onClick={() => setSidebarOpen((prev) => !prev)}
          size="small"
          sx={{
            position: 'absolute',
            top: '50%',
            left: 16,
            transform: 'translateY(-50%)',
            color: '#fff',
            zIndex: 10,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Body: Sidebar + Page Content */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar open={sidebarOpen} />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
            transition: 'margin-left 0.3s',
            bgcolor: '#fafafa',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
