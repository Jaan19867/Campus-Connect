'use client';

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  Dashboard,
  Work,
  Assignment,
  Person,
  Description,
  AccountCircle,
  Logout,
  ContactSupport,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Jobs', icon: <Work />, path: '/jobs' },
  { text: 'My Applications', icon: <Assignment />, path: '/applications' },
  { text: 'My Information', icon: <Person />, path: '/information' },
  { text: 'My Resume', icon: <Description />, path: '/resume' },
  { text: 'My Account', icon: <AccountCircle />, path: '/account' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, student, profilePictureUrl, logout } = useAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
  };

  // Get display name
  const displayName = user?.name || student?.firstName || 'Student';
  const displayRollNumber = user?.rollNumber || student?.rollNumber || '';

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8, // Account for AppBar height
          height: 'calc(100vh - 64px)', // Subtract AppBar height
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(255, 255, 255, 0.2)',
          }
        }}>
          <Avatar 
            src={profilePictureUrl || undefined}
            sx={{ 
              width: 72, 
              height: 72, 
              margin: '0 auto', 
              mb: 2,
              bgcolor: profilePictureUrl ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 600,
              border: '3px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {!profilePictureUrl && (displayRollNumber?.charAt(0)?.toUpperCase() || displayName?.charAt(0)?.toUpperCase() || 'U')}
          </Avatar>
          <Typography variant="h6" noWrap sx={{ fontWeight: 600, mb: 0.5 }}>
            {displayName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }} noWrap>
            {displayRollNumber}
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <List sx={{ flexGrow: 1, px: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: pathname === item.path ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Footer */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Need help?
            </Typography>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              startIcon={<ContactSupport />}
              sx={{ mb: 1 }}
            >
              Contact Team
            </Button>
          </Box>
          
          <Button
            variant="contained"
            color="error"
            size="small"
            fullWidth
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
} 