'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Search,
  Work,
  LocationOn,
  AccessTime,
  Business,
  School,
  TrendingUp,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api';
import { JobWithEligibility, JobStatus } from '@/types';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const EligibilityChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  '&.eligible': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  '&.not-eligible': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobWithEligibility[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithEligibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [eligibilityFilter, setEligibilityFilter] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState<JobWithEligibility | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter, eligibilityFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<JobWithEligibility[]>('/student/jobs');
      setJobs(response);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch jobs');
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Eligibility filter
    if (eligibilityFilter !== 'ALL') {
      filtered = filtered.filter(job => 
        eligibilityFilter === 'ELIGIBLE' ? job.isEligible : !job.isEligible
      );
    }

    setFilteredJobs(filtered);
  };

  const handleJobClick = (job: JobWithEligibility) => {
    setSelectedJob(job);
    setDetailsOpen(true);
  };

  const handleApplyToJob = async (jobId: string) => {
    try {
      setApplying(true);
      await apiClient.post(`/student/jobs/${jobId}/apply`);
      toast.success('Application submitted successfully!');
      setDetailsOpen(false);
      fetchJobs(); // Refresh jobs to update application status
    } catch (error: any) {
      toast.error(error.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedJob(null);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout title="Jobs">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout title="Jobs">
        <Box sx={{ width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Filters */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="ALL">All Status</MenuItem>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Eligibility</InputLabel>
                  <Select
                    value={eligibilityFilter}
                    label="Eligibility"
                    onChange={(e) => setEligibilityFilter(e.target.value)}
                  >
                    <MenuItem value="ALL">All Jobs</MenuItem>
                    <MenuItem value="ELIGIBLE">Eligible Only</MenuItem>
                    <MenuItem value="NOT_ELIGIBLE">Not Eligible</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary">
                  {filteredJobs.length} jobs found
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Jobs Grid */}
          {filteredJobs.length === 0 ? (
            <Alert severity="info">
              No jobs found matching your criteria.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredJobs.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job.id}>
                  <StyledCard onClick={() => handleJobClick(job)}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                          {job.title}
                        </Typography>
                        <EligibilityChip
                          label={job.isEligible ? 'Eligible' : 'Not Eligible'}
                          size="small"
                          className={job.isEligible ? 'eligible' : 'not-eligible'}
                          icon={job.isEligible ? <CheckCircle /> : <Cancel />}
                        />
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.company}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Apply by: {new Date(job.applyBy).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {job.description.substring(0, 100)}...
                      </Typography>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={job.status}
                          color={job.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                        />
                        {job.salary && (
                          <Typography variant="body2" color="primary.main" fontWeight="bold">
                            {job.salary}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Job Details Dialog */}
          <Dialog
            open={detailsOpen}
            onClose={handleCloseDetails}
            maxWidth="md"
            fullWidth
          >
            {selectedJob && (
              <>
                <DialogTitle>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" component="h2">
                      {selectedJob.title}
                    </Typography>
                    <EligibilityChip
                      label={selectedJob.isEligible ? 'Eligible' : 'Not Eligible'}
                      className={selectedJob.isEligible ? 'eligible' : 'not-eligible'}
                      icon={selectedJob.isEligible ? <CheckCircle /> : <Cancel />}
                    />
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Company: {selectedJob.company}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Location: {selectedJob.location}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Apply by: {new Date(selectedJob.applyBy).toLocaleDateString()}
                    </Typography>
                    {selectedJob.salary && (
                      <Typography variant="body1" color="primary.main" fontWeight="bold" gutterBottom>
                        Salary: {selectedJob.salary}
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Job Description
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedJob.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Requirements
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedJob.requirements}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Responsibilities
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedJob.responsibilities}
                    </Typography>
                  </Box>

                  {!selectedJob.isEligible && (
                    <Box sx={{ mb: 3 }}>
                      <Alert severity="warning">
                        <Typography variant="subtitle2" gutterBottom>
                          You are not eligible for this job due to:
                        </Typography>
                        <List dense>
                          {selectedJob.eligibilityReasons.map((reason, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemText primary={`• ${reason}`} />
                            </ListItem>
                          ))}
                        </List>
                      </Alert>
                    </Box>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDetails} color="primary">
                    Close
                  </Button>
                  {selectedJob.isEligible && (
                    <Button
                      onClick={() => handleApplyToJob(selectedJob.id)}
                      variant="contained"
                      color="primary"
                      disabled={applying}
                    >
                      {applying ? <CircularProgress size={20} /> : 'Apply Now'}
                    </Button>
                  )}
                </DialogActions>
              </>
            )}
          </Dialog>
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
} 