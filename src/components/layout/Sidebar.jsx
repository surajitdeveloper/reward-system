/**
 * Sidebar.js
 * Left navigation sidebar with route links.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { ROUTES } from '../../constants/appConstants';

const DRAWER_WIDTH = 220;

const NAV_ITEMS = [
  { label: 'Dashboard',  icon: <DashboardIcon />,    path: ROUTES.DASHBOARD },
  { label: 'Customers',  icon: <PeopleIcon />,        path: ROUTES.CUSTOMERS },
  { label: 'Rewards',    icon: <EmojiEventsIcon />,   path: ROUTES.REWARDS },
];

const Sidebar = ({ open }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: 64, // below AppBar
          height: 'calc(100% - 64px)',
          bgcolor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
          Navigation
        </Typography>
      </Box>
      <Divider />
      <List dense>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                id={`nav-${item.label.toLowerCase()}`}
                selected={isActive}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#e3f2fd',
                    borderRight: '3px solid #1565c0',
                    '& .MuiListItemIcon-root': { color: '#1565c0' },
                    '& .MuiListItemText-primary': { color: '#1565c0', fontWeight: 600 },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

Sidebar.propTypes = {
  /** Whether the sidebar drawer is open */
  open: PropTypes.bool.isRequired,
};

export default Sidebar;
