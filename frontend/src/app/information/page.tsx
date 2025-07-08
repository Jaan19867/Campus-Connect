'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api';
import { Student } from '@/types';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

interface PersonalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function InformationPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  
  // Personal Information Form State
  const [personalFormData, setPersonalFormData] = useState<PersonalFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Student>('/student/my-information/profile');
      setStudent(response);
      
      // Initialize form data with current values
      setPersonalFormData({
        firstName: response.firstName || '',
        lastName: response.lastName || '',
        email: response.email || '',
        phoneNumber: response.phoneNumber || '',
      });
    } catch (error: any) {
      setError(error.message || 'Failed to fetch profile');
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handlePersonalFormChange = (field: keyof PersonalFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPersonalFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handlePersonalFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      setUpdating(true);
      const response = await apiClient.put('/student/my-information/personal', personalFormData);
      
      // Update student state with new data
      setStudent(prev => prev ? { ...prev, ...response } : null);
      
      toast.success('Personal information updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update personal information');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (error || !student) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              {error || 'Student profile not found'}
            </Alert>
          </Box>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            My Information
          </Typography>

          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="information tabs"
                >
                  <StyledTab label="Personal" {...a11yProps(0)} />
                  <StyledTab label="Academic" {...a11yProps(1)} />
                  <StyledTab label="Skills" {...a11yProps(2)} />
                </Tabs>
              </Box>

              {/* Personal Information Tab */}
              <TabPanel value={currentTab} index={0}>
                <StyledPaper elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Personal Information
                  </Typography>
                  
                  <form onSubmit={handlePersonalFormSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={personalFormData.firstName}
                          onChange={handlePersonalFormChange('firstName')}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={personalFormData.lastName}
                          onChange={handlePersonalFormChange('lastName')}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={personalFormData.email}
                          onChange={handlePersonalFormChange('email')}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={personalFormData.phoneNumber}
                          onChange={handlePersonalFormChange('phoneNumber')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Roll Number"
                          value={student.rollNumber}
                          disabled
                          variant="outlined"
                          helperText="Roll number cannot be changed"
                        />
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={updating}
                        sx={{ 
                          bgcolor: '#000',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          '&:hover': { bgcolor: '#333' }
                        }}
                      >
                        {updating ? <CircularProgress size={20} /> : 'UPDATE'}
                      </Button>
                    </Box>
                  </form>
                </StyledPaper>
              </TabPanel>

              {/* Academic Information Tab */}
              <TabPanel value={currentTab} index={1}>
                <StyledPaper elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Academic Information
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Academic information section will be implemented next.
                  </Typography>
                </StyledPaper>
              </TabPanel>

              {/* Skills Tab */}
              <TabPanel value={currentTab} index={2}>
                <StyledPaper elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Skills
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Skills section will be implemented next.
                  </Typography>
                </StyledPaper>
              </TabPanel>
            </CardContent>
          </Card>
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
} 