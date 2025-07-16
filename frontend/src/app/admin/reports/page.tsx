'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Download,
  BarChart,
  PieChart,
  Assessment,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';

interface ReportData {
  totalStudents: number;
  placedStudents: number;
  placementRate: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  averageCGPA: number;
  topBranch: string;
  topCompany: string;
}

interface BranchStats {
  branch: string;
  totalStudents: number;
  placedStudents: number;
  placementRate: number;
  averageCGPA: number;
}

interface CompanyStats {
  company: string;
  jobsPosted: number;
  applications: number;
  studentsSelected: number;
  selectionRate: number;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [branchStats, setBranchStats] = useState<BranchStats[]>([]);
  const [companyStats, setCompanyStats] = useState<CompanyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  useEffect(() => {
    const loadReportData = async () => {
      try {
        // Simulate API loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setReportData({
          totalStudents: 156,
          placedStudents: 23,
          placementRate: 14.7,
          totalJobs: 25,
          activeJobs: 8,
          totalApplications: 342,
          averageCGPA: 8.2,
          topBranch: 'Computer Science',
          topCompany: 'Tech Corp',
        });

        setBranchStats([
          {
            branch: 'Computer Science',
            totalStudents: 45,
            placedStudents: 8,
            placementRate: 17.8,
            averageCGPA: 8.5,
          },
          {
            branch: 'Information Technology',
            totalStudents: 38,
            placedStudents: 6,
            placementRate: 15.8,
            averageCGPA: 8.1,
          },
          {
            branch: 'Electronics',
            totalStudents: 32,
            placedStudents: 5,
            placementRate: 15.6,
            averageCGPA: 7.9,
          },
          {
            branch: 'Mechanical',
            totalStudents: 41,
            placedStudents: 4,
            placementRate: 9.8,
            averageCGPA: 7.8,
          },
        ]);

        setCompanyStats([
          {
            company: 'Tech Corp',
            jobsPosted: 5,
            applications: 89,
            studentsSelected: 4,
            selectionRate: 4.5,
          },
          {
            company: 'Data Solutions',
            jobsPosted: 3,
            applications: 67,
            studentsSelected: 3,
            selectionRate: 4.5,
          },
          {
            company: 'UI Experts',
            jobsPosted: 2,
            applications: 45,
            studentsSelected: 2,
            selectionRate: 4.4,
          },
        ]);
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [selectedPeriod]);

  const StatCard = ({ title, value, subtitle, icon, color, trend }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: `${color}15`,
            color: color,
            mr: 2 
          }}>
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {trend && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: trend === 'up' ? '#2e7d32' : trend === 'down' ? '#d32f2f' : '#757575' 
            }}>
              {trend === 'up' ? <TrendingUp /> : trend === 'down' ? <TrendingDown /> : null}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout title="Reports">
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout title="Reports">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Placement Report - {selectedPeriod}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Period</InputLabel>
                      <Select
                        value={selectedPeriod}
                        label="Period"
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                      >
                        <MenuItem value="2024">2024</MenuItem>
                        <MenuItem value="2023">2023</MenuItem>
                        <MenuItem value="2022">2022</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                    >
                      Export Report
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Key Statistics */}
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Total Students"
              value={reportData?.totalStudents || 0}
              icon={<Assessment />}
              color="#1976d2"
              trend="up"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Placed Students"
              value={reportData?.placedStudents || 0}
              subtitle={`${reportData?.placementRate || 0}% placement rate`}
              icon={<TrendingUp />}
              color="#2e7d32"
              trend="up"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Active Jobs"
              value={reportData?.activeJobs || 0}
              subtitle={`${reportData?.totalJobs || 0} total jobs`}
              icon={<BarChart />}
              color="#ed6c02"
              trend="neutral"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Average CGPA"
              value={reportData?.averageCGPA?.toFixed(1) || '0.0'}
              icon={<PieChart />}
              color="#9c27b0"
              trend="up"
            />
          </Grid>

          {/* Branch-wise Statistics */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Branch-wise Statistics
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Branch</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Students</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Placed</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Rate</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Avg CGPA</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {branchStats.map((branch) => (
                        <TableRow key={branch.branch} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {branch.branch}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{branch.totalStudents}</TableCell>
                          <TableCell align="center">{branch.placedStudents}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${branch.placementRate}%`}
                              size="small"
                              color={branch.placementRate >= 15 ? 'success' : 'warning'}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {branch.averageCGPA.toFixed(1)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Company-wise Statistics */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Company-wise Statistics
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Jobs</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Applications</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Selected</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companyStats.map((company) => (
                        <TableRow key={company.company} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {company.company}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{company.jobsPosted}</TableCell>
                          <TableCell align="center">{company.applications}</TableCell>
                          <TableCell align="center">{company.studentsSelected}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${company.selectionRate}%`}
                              size="small"
                              color={company.selectionRate >= 4 ? 'success' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Top Performing Branch:</strong> {reportData?.topBranch}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Most Active Company:</strong> {reportData?.topCompany}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Total Applications:</strong> {reportData?.totalApplications}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Overall Placement Rate:</strong> {reportData?.placementRate}%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </AdminLayout>
    </AdminProtectedRoute>
  );
} 