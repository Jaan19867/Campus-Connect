'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Avatar,
  Pagination,
  Divider,
} from '@mui/material';
import {
  Search,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api';
import { Job } from '@/types';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  border: '1px solid #e0e0e0',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const JobCard = styled(Card)(({ theme }) => ({
  height: '100%',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
}));

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Job[]>('/student/jobs');
      setJobs(response);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch jobs');
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job =>
    job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getCutoffText = (job: Job) => {
    const cutoffs = [];
    if (job.btech) cutoffs.push(`Btech :${job.btechCutoff}`);
    if (job.mtech) cutoffs.push(`Mtech :${job.mtechCutoff}`);
    if (job.mba) cutoffs.push(`MBA :${job.mbaCutoff}`);
    if (job.ba) cutoffs.push(`BA :${job.baCutoff}`);
    if (job.ma) cutoffs.push(`MA :${job.maCutoff}`);
    
    return cutoffs.join(', ') || 'No specific cutoff';
  };

  const getCompanyInitial = (companyName: string) => {
    return companyName.charAt(0).toUpperCase();
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
        <Box sx={{ width: '100%', p: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search for a Job"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: '600px' }}
            />
          </Box>

          {/* Jobs Grid */}
          <Grid container spacing={3}>
            {currentJobs.map((job) => (
              <Grid item xs={12} md={6} key={job.id}>
                <JobCard>
                  <CardContent sx={{ p: 3 }}>
                    {/* Company Avatar and Job Title */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: '#9E9E9E',
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {getCompanyInitial(job.companyName)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {job.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {job.companyName}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Job Details */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Posted on :</strong> {formatDate(job.createdAt)} {formatTime(job.createdAt)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Deadline to Apply :</strong> {formatDate(job.applicationClosed)} {formatTime(job.applicationClosed)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>CutOff :</strong> {getCutoffText(job)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Stipend :</strong> {job.ctc ? `${job.ctc} per Month` : 'Not specified'}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{ flex: 1 }}
                        onClick={() => {
                          if (job.jobDescription) {
                            window.open(job.jobDescription, '_blank');
                          }
                        }}
                      >
                        KNOW MORE
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ flex: 1 }}
                        onClick={() => {
                          // TODO: Implement application tracking
                          toast.info('Application tracking feature coming soon!');
                        }}
                      >
                        SEE PROGRESS
                      </Button>
                    </Box>
                  </CardContent>
                </JobCard>
              </Grid>
            ))}
          </Grid>

          {/* No Jobs Message */}
          {currentJobs.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No jobs found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
} 