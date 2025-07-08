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
  Autocomplete,
  Paper,
  List,
  ListItem,
  ListItemText,
  Popper,
} from '@mui/material';
import {
  Search,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const router = useRouter();

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

  // Create search options for autocomplete
  interface JobOption {
    label: string;
    company: string;
    id: string;
    job: Job;
  }

  const searchOptions: JobOption[] = jobs.map(job => ({
    label: job.name,
    company: job.companyName,
    id: job.id,
    job: job
  }));

  // Filter jobs based on search term or selected job
  const filteredJobs = jobs.filter(job => {
    if (selectedJob) {
      return job.id === selectedJob.id;
    }
    if (searchTerm) {
      return job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: any, newValue: string) => {
    setSearchTerm(newValue);
    setSelectedJob(null);
    setCurrentPage(1);
  };

  const handleJobSelect = (event: any, newValue: string | JobOption | null) => {
    if (newValue && typeof newValue === 'object') {
      setSelectedJob(newValue.job);
      setSearchTerm(newValue.label);
    } else if (typeof newValue === 'string') {
      setSearchTerm(newValue);
      setSelectedJob(null);
    } else {
      setSelectedJob(null);
      setSearchTerm('');
    }
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedJob(null);
    setCurrentPage(1);
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

          {/* Search Bar with Autocomplete */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Autocomplete<JobOption, false, false, true>
                freeSolo
                options={searchOptions}
                value={selectedJob ? { label: selectedJob.name, company: selectedJob.companyName, id: selectedJob.id, job: selectedJob } : null}
                onChange={handleJobSelect}
                onInputChange={handleSearchChange}
                filterOptions={(options: JobOption[], { inputValue }) => {
                  const filtered = options.filter((option: JobOption) =>
                    option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.company.toLowerCase().includes(inputValue.toLowerCase())
                  );
                  return filtered.slice(0, 10); // Limit to 10 suggestions
                }}
                getOptionLabel={(option: JobOption | string) => {
                  if (typeof option === 'string') {
                    return option;
                  }
                  return option.label || '';
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder="Search for a Job"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '1rem',
                        padding: '8px 14px',
                      },
                    }}
                  />
                )}
                renderOption={(props, option: JobOption) => (
                  <Box component="li" {...props} key={option.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {option.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.company}
                      </Typography>
                    </Box>
                  </Box>
                )}
                sx={{ 
                  flex: 1,
                  '& .MuiAutocomplete-paper': {
                    marginTop: 0.5,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                  '& .MuiAutocomplete-option': {
                    padding: 1.5,
                    borderBottom: '1px solid #f0f0f0',
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                    '&[aria-selected="true"]': {
                      backgroundColor: '#e3f2fd',
                    },
                  },
                }}
                PaperComponent={(props) => (
                  <Paper {...props} sx={{ mt: 1, boxShadow: 3 }} />
                )}
                PopperComponent={(props) => (
                  <Popper {...props} placement="bottom-start" />
                )}
              />
              
              {/* Clear button */}
              {(searchTerm || selectedJob) && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearSearch}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  Clear
                </Button>
              )}
            </Box>
            
            {/* Results count */}
            {(searchTerm || selectedJob) && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''} found
                </Typography>
              </Box>
            )}
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
                          router.push(`/jobs/${job.id}`);
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