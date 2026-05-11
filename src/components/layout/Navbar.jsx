/**
 * Navbar.js
 * Top navigation bar with app title and logout button.
 */

import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import StarsIcon from '@mui/icons-material/Stars';
import { APP_TITLE } from '../../constants/appConstants';

const Navbar = ({ user, onLogout }) => {
  return (
    <AppBar position="static" elevation={1} sx={{ bgcolor: '#1565c0' }}>
      <Toolbar>
        {/* App Icon + Title */}
        <StarsIcon sx={{ mr: 1, color: '#ffd54f' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {APP_TITLE}
        </Typography>

        {/* User info */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#ffd54f', color: '#1565c0', fontSize: 14 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ color: '#e3f2fd' }}>
              {user?.name}
            </Typography>
            <Tooltip title="Logout">
              <Button
                id="btn-logout"
                color="inherit"
                onClick={onLogout}
                startIcon={<LogoutIcon />}
                size="small"
                sx={{ ml: 1, color: '#e3f2fd' }}
              >
                Logout
              </Button>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  /** Logged-in user object */
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }),
  /** Callback fired when logout is clicked */
  onLogout: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  user: null,
};

export default Navbar;
