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
} from '@mui/material';
import {
  Dashboard,
  Work,
  Business,
  People,
  Assignment,
  BarChart,
  Settings,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { text: 'Job Management', icon: <Work />, path: '/admin/jobs' },
  { text: 'Students', icon: <People />, path: '/admin/students' },
  { text: 'Report', icon: <BarChart />, path: '/admin/reports' },
  { text: 'My Account', icon: <Settings />, path: '/admin/account' },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin } = useAdminAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  // Get display name
  const displayName = admin?.firstName && admin?.lastName 
    ? `${admin.firstName} ${admin.lastName}`
    : admin?.email?.split('@')[0] || 'Admin';

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
          background: 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)',
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
          <Avatar sx={{ 
            width: 72, 
            height: 72, 
            margin: '0 auto', 
            mb: 2,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 600,
            border: '3px solid rgba(255, 255, 255, 0.3)',
          }}>
            <AdminPanelSettings sx={{ fontSize: '2rem' }} />
          </Avatar>
          <Typography variant="h6" noWrap sx={{ fontWeight: 600, mb: 0.5 }}>
            {displayName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }} noWrap>
            Placement Cell Admin
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#1a237e',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#303f9f',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(26, 35, 126, 0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: pathname === item.path ? 'inherit' : '#1a237e',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Footer */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            TNP Management System
          </Typography>
          <Typography variant="caption" color="text.secondary">
            v1.0.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
} 