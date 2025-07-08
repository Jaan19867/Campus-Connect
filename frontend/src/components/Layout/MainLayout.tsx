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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
} from '@mui/icons-material';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function MainLayout({ children, title = 'Dashboard' }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, student, profilePictureUrl } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Get display name
  const displayName = user?.name || student?.firstName || 'Student';
  const displayRollNumber = user?.rollNumber || student?.rollNumber || '';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3 } }}>
          {/* Left side - Menu and Profile */}
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
            
            {/* User Profile Section - Top Left */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar 
                src={profilePictureUrl || undefined}
                sx={{ 
                  width: 44, 
                  height: 44, 
                  bgcolor: profilePictureUrl ? 'transparent' : 'primary.main',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  border: '2px solid',
                  borderColor: 'primary.light',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {!profilePictureUrl && (displayRollNumber?.charAt(0)?.toUpperCase() || displayName?.charAt(0)?.toUpperCase() || 'U')}
              </Avatar>
              {!isMobile && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'text.primary' }}>
                    {displayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                    {displayRollNumber}
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
              color: 'primary.main',
              textAlign: 'center',
            }}
          >
            TNP RM
          </Typography>

          {/* Right side - Notifications */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Account for AppBar height
          minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
          backgroundColor: 'background.default',
          overflow: 'auto',
        }}
      >
        {/* Page Title */}
        <Box sx={{ mb: 3 }}>
        
          <Typography variant="body1" color="text.secondary">
            Welcome back, {displayName || displayRollNumber || 'Student'}!
          </Typography>
        </Box>

        {/* Page Content */}
        {children}
      </Box>
    </Box>
  );
} 