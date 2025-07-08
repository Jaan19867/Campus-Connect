'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Event,
  AccessTime,
  Business,
  LocationOn,
  Notifications,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api';
import { Job, Event as EventType, JobWithEligibility } from '@/types';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));



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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function DashboardPage() {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState<JobWithEligibility[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch notifications (eligible jobs)
      const notificationsResponse = await apiClient.get<JobWithEligibility[]>('/student/dashboard/notifications');
      setNotifications(notificationsResponse);

      // Fetch events
      const eventsResponse = await apiClient.get<EventType[]>('/student/dashboard/events');
      setEvents(eventsResponse);

    } catch (error: any) {
      setError(error.message || 'Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  return (
    <ProtectedRoute>
      <MainLayout>
        <Box sx={{ width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Tabs for Notifications and Events */}
          <StyledCard>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                  <Tab 
                    icon={<Notifications />} 
                    label="Notifications" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<Event />} 
                    label="Events" 
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Jobs You Can Apply To
                  </Typography>
                  
                  {notifications.length === 0 ? (
                    <Alert severity="info">
                      No jobs available that match your eligibility criteria.
                    </Alert>
                  ) : (
                    <List>
                      {notifications.map((job, index) => (
                        <React.Fragment key={job.id}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <Business />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography variant="subtitle1" fontWeight="medium">
                                    {job.title}
                                  </Typography>
                                  <Chip 
                                    label="Eligible" 
                                    color="success" 
                                    size="small"
                                  />
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {job.company}
                                  </Typography>
                                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                      <LocationOn sx={{ fontSize: 16 }} />
                                      <Typography variant="caption">
                                        {job.location}
                                      </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                      <AccessTime sx={{ fontSize: 16 }} />
                                      <Typography variant="caption">
                                        Apply by: {new Date(job.applyBy).toLocaleDateString()}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              }
                            />
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              sx={{ ml: 2 }}
                            >
                              View Details
                            </Button>
                          </ListItem>
                          {index < notifications.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Upcoming Events
                  </Typography>
                  
                  {events.length === 0 ? (
                    <Alert severity="info">
                      No upcoming events scheduled.
                    </Alert>
                  ) : (
                    <List>
                      {events.map((event, index) => (
                        <React.Fragment key={event.id}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                <Event />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography variant="subtitle1" fontWeight="medium">
                                    {event.title}
                                  </Typography>
                                  <Chip 
                                    label={event.eventType.replace('_', ' ')} 
                                    color="primary" 
                                    size="small"
                                  />
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {event.company}
                                  </Typography>
                                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                      <LocationOn sx={{ fontSize: 16 }} />
                                      <Typography variant="caption">
                                        {event.location}
                                      </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                      <AccessTime sx={{ fontSize: 16 }} />
                                      <Typography variant="caption">
                                        {new Date(event.eventDate).toLocaleDateString()}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              }
                            />
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              sx={{ ml: 2 }}
                            >
                              View Details
                            </Button>
                          </ListItem>
                          {index < events.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </Box>
              </TabPanel>
            </CardContent>
          </StyledCard>
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
} 