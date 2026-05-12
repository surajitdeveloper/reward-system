/**
 * Navbar.jsx
 * Simple top navigation with app title, route links, and logout.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import StarsIcon from '@mui/icons-material/Stars';
import { APP_TITLE, ROUTES } from '../../constants/appConstants';

const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD },
  { label: 'Customers', path: ROUTES.CUSTOMERS },
  { label: 'Rewards', path: ROUTES.REWARDS },
];

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" elevation={2} sx={{ bgcolor: '#1565c0' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarsIcon sx={{ color: '#ffd54f' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {APP_TITLE}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{ textTransform: 'none' }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#ffd54f', color: '#1565c0', fontSize: 14 }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography sx={{ color: '#e3f2fd' }}>{user.name}</Typography>
            <Button
              id="btn-logout"
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
              sx={{ borderColor: 'rgba(255,255,255,0.5)', textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  user: null,
};

export default Navbar;
