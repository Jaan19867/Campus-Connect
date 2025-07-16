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
  TextField,
  InputAdornment,
  Grid,
  LinearProgress,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Search,
  Visibility,
  Person,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

interface Student {
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
  applications?: any[];
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const studentsData = await adminApi.getAllStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error('Error loading students:', error);
        setError(error instanceof Error ? error.message : 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalApplications = students.reduce((sum, student) => sum + (student.applications?.length || 0), 0);

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout title="Students">
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout title="Students">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    All Students ({students.length})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Applications: {totalApplications}
                  </Typography>
                </Box>
                
                {/* Search */}
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

          {/* Students Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Roll Number</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 40, height: 40, bgcolor: '#1976d2' }}>
                                {`${student.firstName} ${student.lastName}`.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Box>
                                                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {student.firstName} {student.lastName}
                              </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {student.branch}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {student.rollNumber}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => router.push(`/admin/students/${student.id}`)}
                              sx={{ 
                                color: '#1976d2',
                                borderColor: '#1976d2',
                                '&:hover': {
                                  borderColor: '#1565c0',
                                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                }
                              }}
                            >
                              See More Info
                            </Button>
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