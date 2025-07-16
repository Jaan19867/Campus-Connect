'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Logout,
  AdminPanelSettings,
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = 'Admin Dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAdminAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Get display name
  const displayName = admin?.firstName && admin?.lastName 
    ? `${admin.firstName} ${admin.lastName}`
    : admin?.email?.split('@')[0] || 'Admin';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1a237e',
          color: 'white',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3 } }}>
          {/* Left side - Menu and Admin Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ p: 1 }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Admin Profile Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar 
                sx={{ 
                  width: 44, 
                  height: 44, 
                  bgcolor: '#3f51b5',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                <AdminPanelSettings />
              </Avatar>
              {!isMobile && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'white' }}>
                    {displayName}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1.2 }}>
                    Placement Cell Admin
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          {/* Center - Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            TNP Admin Panel
          </Typography>

          {/* Right side - Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                textTransform: 'none',
              }}
            >
              Logout
            </Button>
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              sx={{ display: { xs: 'flex', sm: 'none' } }}
            >
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={handleSidebarClose} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Account for AppBar height
          minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
          backgroundColor: '#f5f5f5',
          overflow: 'auto',
        }}
      >
        {/* Page Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {displayName}!
          </Typography>
        </Box>

        {/* Page Content */}
        {children}
      </Box>
    </Box>
  );
} 