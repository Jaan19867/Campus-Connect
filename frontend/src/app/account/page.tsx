'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  IconButton,
  InputAdornment,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CloudUpload,
  Close,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: '800px',
  margin: '0 auto',
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
}));

const ProfilePictureContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  marginBottom: theme.spacing(2),
  border: '4px solid #e0e0e0',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: '#1976d2',
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#9c27b0',
  color: 'white',
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: 'bold',
  borderRadius: '6px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#7b1fa2',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ccc',
  color: 'white',
  padding: '12px 40px',
  fontSize: '16px',
  fontWeight: 'bold',
  borderRadius: '6px',
  textTransform: 'none',
  marginTop: theme.spacing(3),
  '&:not(:disabled)': {
    backgroundColor: '#1976d2',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
}));

const HiddenFileInput = styled('input')({
  display: 'none',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
  color: '#333',
}));

const ValidationText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: '#f44336',
  marginTop: theme.spacing(1),
}));

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function AccountPage() {
  const { refreshProfilePicture } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const fetchProfilePicture = async () => {
    try {
      // Try to fetch profile picture - if it doesn't exist, just use default
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3009'}/student/auth/profile-picture`, {
        headers: {
          Authorization: `Bearer ${apiClient.getToken()}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicture(imageUrl);
      }
    } catch (error) {
      // Profile picture doesn't exist yet, which is fine
      console.log('No profile picture found');
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only image files (JPG, PNG, GIF, WebP) are allowed');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should not exceed 2 MB');
      return;
    }

    try {
      setUploading(true);
      
      // Upload file
      const uploadedResponse = await apiClient.uploadFile('/student/auth/profile-picture', file);
      
      // Update local preview
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
      
      // Refresh profile picture in AuthContext for sidebar and header
      await refreshProfilePicture();
      
      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }

    // Reset file input
    event.target.value = '';
  };

  const handlePasswordChange = (field: keyof PasswordFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setPasswordError('');
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError('');
    
    // Validate new password
    if (!validatePassword(passwordData.newPassword)) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      await apiClient.put('/student/auth/change-password', passwordData);
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      
      toast.success('Password changed successfully!');
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordFormValid = () => {
    return passwordData.currentPassword && 
           passwordData.newPassword && 
           passwordData.confirmNewPassword &&
           validatePassword(passwordData.newPassword) &&
           passwordData.newPassword === passwordData.confirmNewPassword;
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <Box sx={{ p: 3, maxWidth: '900px', margin: '0 auto' }}>
          <StyledCard>
            <CardContent>
              {/* Profile Picture Section */}
              <ProfilePictureContainer>
                <ProfileAvatar
                  src={profilePicture}
                  onClick={() => profilePicture && setImageDialogOpen(true)}
                  sx={{ 
                    bgcolor: profilePicture ? 'transparent' : '#f0f0f0',
                    cursor: profilePicture ? 'pointer' : 'default',
                    '&:hover': profilePicture ? {
                      transform: 'scale(1.05)',
                      borderColor: '#1976d2',
                    } : {},
                  }}
                >
                  {!profilePicture && !uploading && (
                    <CloudUpload sx={{ fontSize: 40, color: '#666' }} />
                  )}
                  {uploading && <CircularProgress size={40} />}
                </ProfileAvatar>
                
                <SectionTitle>Change Your Profile Picture</SectionTitle>
                <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                  Upload Your New Profile Picture (&lt;2mb)
                </Typography>
                
                <UploadButton
                  variant="contained"
                  onClick={handleFileSelect}
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                >
                  {uploading ? 'UPLOADING...' : 'CLICK TO UPLOAD NEW'}
                </UploadButton>

                <HiddenFileInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </ProfilePictureContainer>

              {/* Password Change Section */}
              <Box sx={{ mt: 6 }}>
                <SectionTitle>Change Your Password</SectionTitle>
                
                <form onSubmit={handlePasswordSubmit}>
                  <Grid container spacing={3}>
                    {/* Current Password */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Enter Your Current Password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange('currentPassword')}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                edge="end"
                              >
                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* New Password */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Enter Your New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange('newPassword')}
                        variant="outlined"
                        error={!!passwordData.newPassword && !validatePassword(passwordData.newPassword)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                edge="end"
                              >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      {passwordData.newPassword && !validatePassword(passwordData.newPassword) && (
                        <ValidationText>
                          Password must be at least 6 characters long
                        </ValidationText>
                      )}
                    </Grid>

                    {/* Confirm New Password */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Re-enter Your New Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange('confirmNewPassword')}
                        variant="outlined"
                        error={!!passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      {passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword && (
                        <ValidationText>
                          Passwords don't match
                        </ValidationText>
                      )}
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                      <SubmitButton
                        type="submit"
                        variant="contained"
                        disabled={!isPasswordFormValid() || loading}
                      >
                        {loading ? <CircularProgress size={20} /> : 'SUBMIT'}
                      </SubmitButton>
                    </Grid>

                    {/* Error Messages */}
                    {passwordError && (
                      <Grid item xs={12}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#f44336', 
                            textAlign: 'center',
                            mt: 1 
                          }}
                        >
                          {passwordError}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </form>
              </Box>
            </CardContent>
          </StyledCard>

          {/* Image View Modal */}
          <Dialog 
            open={imageDialogOpen} 
            onClose={() => setImageDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Profile Picture
                <IconButton onClick={() => setImageDialogOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '500px', 
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }} 
                />
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
} 