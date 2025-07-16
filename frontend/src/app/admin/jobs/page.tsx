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
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  FilterList,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

interface Job {
  id: string;
  name: string;
  companyName: string;
  location?: string;
  jobType: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT' | 'CANCELLED';
  applications?: any[];
  applicationClosed: string;
  createdAt: string;
}

export default function JobManagementPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'fulltime':
      case 'full_time':
      case 'fte':
        return 'primary';
      case 'parttime':
      case 'part_time':
        return 'info';
      case 'intern':
      case 'internship':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout title="Job Management">
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout title="Job Management">
        <Grid container spacing={3}>
          {/* Header Actions */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    All Jobs ({jobs.length})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => router.push('/admin/jobs/create')}
                    sx={{ bgcolor: '#1976d2' }}
                  >
                    Create New Job
                  </Button>
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
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                  >
                    Filters
                  </Button>
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
                        <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Applications</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Deadline</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredJobs.map((job) => (
                        <TableRow key={job.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {job.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{job.companyName}</TableCell>
                          <TableCell>{job.location || 'Not specified'}</TableCell>
                          <TableCell>
                            <Chip
                              label={job.jobType?.replace('_', ' ') || 'Not specified'}
                              size="small"
                              color={getTypeColor(job.jobType) as any}
                            />
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
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton 
                                size="small" 
                                onClick={() => router.push(`/admin/jobs/${job.id}`)}
                                sx={{ color: '#1976d2' }}
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton 
                                size="small"
                                onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}
                                sx={{ color: '#ed6c02' }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton 
                                size="small"
                                sx={{ color: '#d32f2f' }}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </AdminLayout>
    </AdminProtectedRoute>
  );
} 