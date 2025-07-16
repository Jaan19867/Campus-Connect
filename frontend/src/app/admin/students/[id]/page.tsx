'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  CalendarToday,
  LinkedIn,
  GitHub,
  Language,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

interface Application {
  id: string;
  job: {
    id: string;
    name: string;
    companyName: string;
    status: string;
  };
  status: string;
  createdAt: string;
}

interface StudentInfo {
  id: string;
  rollNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  branch: string;
  currentYear: number;
  gpa: number;
  cgpa?: number;
  isActive: boolean;
  createdAt: string;
  applications: Application[];
  skills?: { id: string; skillName: string }[];
  languages?: { id: string; language: string }[];
  resumes?: { id: string; fileName: string; url: string }[];
}

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudentInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getStudentById(studentId);
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load student info');
      } finally {
        setLoading(false);
      }
    };
    loadStudentInfo();
  }, [studentId]);

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

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout title="Student Information">
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  if (error) {
    return (
      <AdminProtectedRoute>
        <AdminLayout title="Student Not Found">
          <Alert severity="error">{error}</Alert>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  if (!student) {
    return (
      <AdminProtectedRoute>
        <AdminLayout title="Student Not Found">
          <Typography>Student not found</Typography>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout title={`${student.firstName} ${student.lastName} - Student Information`}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        bgcolor: '#1976d2',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {`${student.firstName} ${student.lastName}`.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {student.firstName} {student.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.email} | {student.rollNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.branch.replace('_', ' ')} | Year {student.currentYear}
                      </Typography>
                    </Box>
                  </Box>
                  <Button startIcon={<ArrowBack />} onClick={() => router.back()} variant="outlined">
                    Back
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Skills & Languages */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Skills
                </Typography>
                {student.skills && student.skills.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {student.skills.map(skill => (
                      <Chip key={skill.id} label={skill.skillName} color="primary" />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary">No skills listed.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Languages
                </Typography>
                {student.languages && student.languages.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {student.languages.map(lang => (
                      <Chip key={lang.id} label={lang.language} color="secondary" />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary">No languages listed.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Applications Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Applications
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Applied At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {student.applications && student.applications.length > 0 ? (
                        student.applications.map(app => (
                          <TableRow key={app.id}>
                            <TableCell>{app.job?.name || '-'}</TableCell>
                            <TableCell>{app.job?.companyName || '-'}</TableCell>
                            <TableCell>
                              <Chip label={app.status} color={getStatusColor(app.status) as any} size="small" />
                            </TableCell>
                            <TableCell>{new Date(app.createdAt).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No applications found.
                          </TableCell>
                        </TableRow>
                      )}
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