import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Group, People, Payment, Assessment } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: <Dashboard /> },
    { label: 'Members', path: '/members', icon: <Group /> },
    { label: 'Dependants', path: '/dependants', icon: <People /> },
    { label: 'Payments', path: '/payments', icon: <Payment /> },
    { label: 'Reports', path: '/reports', icon: <Assessment /> }
  ];

  return (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.path} disablePadding>
          <ListItemButton
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default Navigation;
