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
  Avatar,
} from '@mui/material';
import {
  Search,
  ArrowBack,
  Download,
  Business,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';

interface JobDetails {
  id: number;
  title: string;
  company: string;
  status: 'OPEN' | 'CLOSED';
  deadline: string;
  description: string;
}

interface StudentApplication {
  id: number;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  branch: string;
  cgpa: number;
  resumeUrl: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'NOT_SHORTLISTED' | 'SELECTED' | 'REJECTED';
  appliedAt: string;
}

export default function JobApplicationsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const studentsPerPage = 10;

  useEffect(() => {
    const loadJobApplications = async () => {
      try {
        // Simulate API loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock job details
        setJobDetails({
          id: parseInt(jobId),
          title: 'Software Engineer',
          company: 'Google',
          status: 'OPEN',
          deadline: '2025-01-15',
          description: 'We are looking for a talented Software Engineer to join our team...',
        });

        // Mock applications data
        setApplications([
          {
            id: 1,
            studentName: 'John Doe',
            studentEmail: 'john.doe@example.com',
            rollNumber: '2021CS001',
            branch: 'Computer Science',
            cgpa: 8.5,
            resumeUrl: '/resumes/john_doe_resume.pdf',
            status: 'APPLIED',
            appliedAt: '2025-01-08 10:30',
          },
          {
            id: 2,
            studentName: 'Jane Smith',
            studentEmail: 'jane.smith@example.com',
            rollNumber: '2021CS002',
            branch: 'Computer Science',
            cgpa: 9.2,
            resumeUrl: '/resumes/jane_smith_resume.pdf',
            status: 'SHORTLISTED',
            appliedAt: '2025-01-08 09:15',
          },
          {
            id: 3,
            studentName: 'Mike Johnson',
            studentEmail: 'mike.johnson@example.com',
            rollNumber: '2021IT001',
            branch: 'Information Technology',
            cgpa: 7.8,
            resumeUrl: '/resumes/mike_johnson_resume.pdf',
            status: 'SELECTED',
            appliedAt: '2025-01-07 14:45',
          },
          {
            id: 4,
            studentName: 'Sarah Wilson',
            studentEmail: 'sarah.wilson@example.com',
            rollNumber: '2021EC001',
            branch: 'Electronics',
            cgpa: 8.9,
            resumeUrl: '/resumes/sarah_wilson_resume.pdf',
            status: 'NOT_SHORTLISTED',
            appliedAt: '2025-01-07 16:20',
          },
          {
            id: 5,
            studentName: 'David Brown',
            studentEmail: 'david.brown@example.com',
            rollNumber: '2021CS003',
            branch: 'Computer Science',
            cgpa: 8.1,
            resumeUrl: '/resumes/david_brown_resume.pdf',
            status: 'APPLIED',
            appliedAt: '2025-01-08 11:45',
          },
          {
            id: 6,
            studentName: 'Emily Davis',
            studentEmail: 'emily.davis@example.com',
            rollNumber: '2021IT002',
            branch: 'Information Technology',
            cgpa: 8.7,
            resumeUrl: '/resumes/emily_davis_resume.pdf',
            status: 'SHORTLISTED',
            appliedAt: '2025-01-08 08:30',
          },
          {
            id: 7,
            studentName: 'Alex Thompson',
            studentEmail: 'alex.thompson@example.com',
            rollNumber: '2021ME001',
            branch: 'Mechanical',
            cgpa: 7.5,
            resumeUrl: '/resumes/alex_thompson_resume.pdf',
            status: 'REJECTED',
            appliedAt: '2025-01-06 15:10',
          },
          {
            id: 8,
            studentName: 'Lisa Garcia',
            studentEmail: 'lisa.garcia@example.com',
            rollNumber: '2021CS004',
            branch: 'Computer Science',
            cgpa: 9.0,
            resumeUrl: '/resumes/lisa_garcia_resume.pdf',
            status: 'APPLIED',
            appliedAt: '2025-01-08 13:20',
          },
          {
            id: 9,
            studentName: 'Tom Anderson',
            studentEmail: 'tom.anderson@example.com',
            rollNumber: '2021EC002',
            branch: 'Electronics',
            cgpa: 8.3,
            resumeUrl: '/resumes/tom_anderson_resume.pdf',
            status: 'APPLIED',
            appliedAt: '2025-01-08 12:15',
          },
          {
            id: 10,
            studentName: 'Rachel Lee',
            studentEmail: 'rachel.lee@example.com',
            rollNumber: '2021IT003',
            branch: 'Information Technology',
            cgpa: 8.6,
            resumeUrl: '/resumes/rachel_lee_resume.pdf',
            status: 'SHORTLISTED',
            appliedAt: '2025-01-07 17:30',
          },
        ]);
      } catch (error) {
        console.error('Error loading job applications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobApplications();
  }, [jobId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'primary';
      case 'SHORTLISTED': return 'info';
      case 'NOT_SHORTLISTED': return 'warning';
      case 'SELECTED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredApplications.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredApplications.length / studentsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      setUpdatingStatus(applicationId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus as any }
            : app
        )
      );
      
      toast.success('Status updated successfully!');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout title="Job Applications">
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  if (!jobDetails) {
    return (
      <AdminProtectedRoute>
        <AdminLayout title="Job Not Found">
          <Typography>Job not found</Typography>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout title={`${jobDetails.title} - Applications`}>
        <Grid container spacing={3}>
          {/* Job Details Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {jobDetails.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Business sx={{ fontSize: 20, color: 'action.active' }} />
                        <Typography variant="body1">{jobDetails.company}</Typography>
                      </Box>
                      <Chip
                        label={jobDetails.status}
                        size="small"
                        color={jobDetails.status === 'OPEN' ? 'success' : 'error'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Deadline: {new Date(jobDetails.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => router.push('/admin/dashboard')}
                  >
                    Back to Dashboard
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Applications Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Students Applied ({applications.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                  >
                    Export Applications
                  </Button>
                </Box>
                
                {/* Search and Filters */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    placeholder="Search students..."
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
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status Filter</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status Filter"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="ALL">All Status</MenuItem>
                      <MenuItem value="APPLIED">Applied</MenuItem>
                      <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
                      <MenuItem value="NOT_SHORTLISTED">Not Shortlisted</MenuItem>
                      <MenuItem value="SELECTED">Selected</MenuItem>
                      <MenuItem value="REJECTED">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Students Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Resume</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Change Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentStudents.map((application) => (
                        <TableRow key={application.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 40, height: 40, bgcolor: '#1976d2' }}>
                                {application.studentName.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {application.studentName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {application.rollNumber} • {application.branch}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                  CGPA: {application.cgpa.toFixed(1)}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => window.open(application.resumeUrl, '_blank')}
                              sx={{ 
                                color: '#1976d2',
                                borderColor: '#1976d2',
                                '&:hover': {
                                  borderColor: '#1565c0',
                                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                }
                              }}
                            >
                              View Resume
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={application.status.replace('_', ' ')}
                              size="small"
                              color={getStatusColor(application.status) as any}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                              <Select
                                value={application.status}
                                onChange={(e) => handleStatusChange(application.id, e.target.value)}
                                disabled={updatingStatus === application.id}
                                size="small"
                              >
                                <MenuItem value="APPLIED">Applied</MenuItem>
                                <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
                                <MenuItem value="NOT_SHORTLISTED">Not Shortlisted</MenuItem>
                                <MenuItem value="SELECTED">Selected</MenuItem>
                                <MenuItem value="REJECTED">Rejected</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleStatusChange(application.id, application.status)}
                              disabled={updatingStatus === application.id}
                              sx={{ bgcolor: '#1976d2' }}
                            >
                              {updatingStatus === application.id ? 'Updating...' : 'Update'}
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