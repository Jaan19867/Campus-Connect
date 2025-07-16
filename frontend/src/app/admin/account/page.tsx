'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  AdminPanelSettings,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { toast } from 'react-toastify';

interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  lastLogin: string;
}

export default function MyAccountPage() {
  const { admin, updateAdmin } = useAdminAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<AdminProfile>({
    firstName: admin?.firstName || '',
    lastName: admin?.lastName || '',
    email: admin?.email || '',
    phone: '',
    department: 'Placement Cell',
    position: 'Admin',
    lastLogin: admin?.lastLogin || '',
  });

  const handleInputChange = (field: keyof AdminProfile) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update admin context
      updateAdmin({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile({
      firstName: admin?.firstName || '',
      lastName: admin?.lastName || '',
      email: admin?.email || '',
      phone: '',
      department: 'Placement Cell',
      position: 'Admin',
      lastLogin: admin?.lastLogin || '',
    });
    setIsEditing(false);
  };

  const displayName = admin?.firstName && admin?.lastName 
    ? `${admin.firstName} ${admin.lastName}`
    : admin?.email?.split('@')[0] || 'Admin';

  return (
    <AdminProtectedRoute>
      <AdminLayout title="My Account">
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      bgcolor: '#1a237e',
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                    }}
                  >
                    <AdminPanelSettings sx={{ fontSize: '3rem' }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {displayName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Placement Cell Administrator
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last login: {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                    </Typography>
                  </Box>
                  <Button
                    variant={isEditing ? "outlined" : "contained"}
                    startIcon={isEditing ? <Cancel /> : <Edit />}
                    onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                    sx={{ 
                      bgcolor: isEditing ? 'transparent' : '#1976d2',
                      color: isEditing ? '#1976d2' : 'white',
                    }}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Form */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Personal Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profile.firstName}
                      onChange={handleInputChange('firstName')}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: 'action.active' }}>
                            <AdminPanelSettings />
                          </Box>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profile.lastName}
                      onChange={handleInputChange('lastName')}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={profile.email}
                      onChange={handleInputChange('email')}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: 'action.active' }}>
                            <Email />
                          </Box>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profile.phone}
                      onChange={handleInputChange('phone')}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: 'action.active' }}>
                            <Phone />
                          </Box>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={profile.department}
                      onChange={handleInputChange('department')}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: 'action.active' }}>
                            <LocationOn />
                          </Box>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Position"
                      value={profile.position}
                      onChange={handleInputChange('position')}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      onClick={handleSave}
                      disabled={loading}
                      sx={{ bgcolor: '#1976d2' }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Account Info */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Account Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Account Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Administrator
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Last Login
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Security Note:</strong> For password changes, please contact the IT department.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </AdminLayout>
    </AdminProtectedRoute>
  );
} 