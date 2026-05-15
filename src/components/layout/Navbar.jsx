/**
 * Navbar.jsx
 * Simple top navigation with app title, route links, and logout.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();

  return (
    <AppBar position="fixed" elevation={2} sx={{ bgcolor: '#0f4c81' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarsIcon sx={{ color: '#ffd54f' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.01em' }}>
              {APP_TITLE}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
              Reward analytics & customer insights
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  textTransform: 'none',
                  color: isActive ? '#ffd54f' : 'rgba(255,255,255,0.85)',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#ffd54f', color: '#0f4c81', fontSize: 14 }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography sx={{ color: '#f8fafc', fontWeight: 500 }}>{user.name}</Typography>
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
