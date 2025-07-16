'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Alert,
} from '@mui/material';
import {
  Search,
  Visibility,
  Work,
  Business,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

interface Job {
  id: string;
  name: string;
  companyName: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT' | 'CANCELLED';
  applications?: any[];
  applicationClosed: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const jobsData = await adminApi.getAllJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error loading jobs:', error);
        setError(error instanceof Error ? error.message : 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'success';
      case 'CLOSED': return 'error';
      case 'DRAFT': return 'warning';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout title="Dashboard">
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout title="Dashboard">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Job Applications Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Jobs: {jobs.length} | Total Applications: {totalApplications}
                  </Typography>
                </Box>
                
                {/* Search and Filters */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
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
                    sx={{ minWidth: 300 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="ALL">All Status</MenuItem>
                      <MenuItem value="OPEN">Open</MenuItem>
                      <MenuItem value="CLOSED">Closed</MenuItem>
                      <MenuItem value="DRAFT">Draft</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Error Alert */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grid>
          )}

          {/* Jobs Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Job Post</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Applications</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Deadline</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentJobs.map((job) => (
                        <TableRow key={job.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {job.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Business sx={{ fontSize: 20, color: 'action.active' }} />
                              {job.companyName}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={job.status}
                              size="small"
                              color={getStatusColor(job.status) as any}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {job.applications?.length || 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {new Date(job.applicationClosed).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => router.push(`/admin/jobs/${job.id}/applications`)}
                              sx={{ 
                                color: '#1976d2',
                                borderColor: '#1976d2',
                                '&:hover': {
                                  borderColor: '#1565c0',
                                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                }
                              }}
                            >
                              See More
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </AdminLayout>
    </AdminProtectedRoute>
  );
} 