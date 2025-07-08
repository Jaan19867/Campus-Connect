'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Link,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api';
import { Job } from '@/types';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiTableHead-root': {
    backgroundColor: '#000',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    color: 'white',
    fontWeight: 'bold',
    padding: theme.spacing(2),
  },
  '& .MuiTableBody-root .MuiTableCell-root': {
    padding: theme.spacing(2),
  },
  '& .not-eligible': {
    backgroundColor: '#ffebee',
    borderLeft: '4px solid #f44336',
  },
  '& .eligible': {
    backgroundColor: '#e8f5e8',
    borderLeft: '4px solid #4caf50',
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
  '& .label': {
    fontWeight: 'bold',
    minWidth: '150px',
  },
  '& .value': {
    flex: 1,
  },
}));

export default function JobDetailsPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Job>(`/student/jobs/${jobId}`);
      setJob(response);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch job details');
      toast.error('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      await apiClient.post(`/student/jobs/${jobId}/apply`);
      toast.success('Application submitted successfully!');
      // Refresh job details to update application status
      fetchJobDetails();
    } catch (error: any) {
      toast.error(error.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  const handleBack = () => {
    router.back();
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

  const getEligibilityData = (job: Job) => {
    const programs = [
      {
        name: 'BTech',
        eligible: job.btech || false,
        cutoff: job.btechCutoff || 0,
        branches: job.btechBranches || [],
      },
      {
        name: 'MTech',
        eligible: job.mtech || false,
        cutoff: job.mtechCutoff || 0,
        branches: job.mtechBranches || [],
      },
      {
        name: 'MSc',
        eligible: job.msc || false,
        cutoff: job.mscCutoff || 0,
        branches: job.mscBranches || [],
      },
      {
        name: 'MBA',
        eligible: job.mba || false,
        cutoff: job.mbaCutoff || 0,
        branches: job.mbaBranches || [],
      },
      {
        name: 'BBA',
        eligible: job.bba || false,
        cutoff: job.bbaCutoff || 0,
        branches: [],
      },
      {
        name: 'BA(Eco)',
        eligible: job.ba || false,
        cutoff: job.baCutoff || 0,
        branches: [],
      },
      {
        name: 'MA(Eco)',
        eligible: job.ma || false,
        cutoff: job.maCutoff || 0,
        branches: [],
      },
      {
        name: 'BDes',
        eligible: job.bdes || false,
        cutoff: job.bdesCutoff || 0,
        branches: [],
      },
    ];

    return programs;
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

  if (error || !job) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <Box sx={{ p: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{ mb: 2 }}
            >
              BACK
            </Button>
            <Alert severity="error">
              {error || 'Job not found'}
            </Alert>
          </Box>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const eligibilityData = getEligibilityData(job);

  return (
    <ProtectedRoute>
      <MainLayout>
        <Box sx={{ p: 3 }}>
          {/* Header with Back button and Apply button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{ 
                bgcolor: '#000',
                color: 'white',
                '&:hover': { bgcolor: '#333' }
              }}
            >
              BACK
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleApply}
                disabled={applying}
                sx={{ 
                  bgcolor: '#000',
                  color: 'white',
                  px: 4,
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                {applying ? <CircularProgress size={20} /> : 'APPLY NOW'}
              </Button>
              <Button
                variant="contained"
                sx={{ 
                  bgcolor: '#000',
                  color: 'white',
                  px: 4,
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                SEE PROGRESS
              </Button>
            </Box>
          </Box>

          {/* Job Title and Company */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {job.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {job.jobType},{job.companyName}
            </Typography>
            
            {job.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOn sx={{ fontSize: 20 }} />
                <Typography variant="body1">{job.location}</Typography>
              </Box>
            )}
          </Box>

          {/* Application Dates */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                <strong>Applications Open :</strong> {formatDate(job.applicationOpen)} {formatTime(job.applicationOpen)}
              </Typography>
              <Typography variant="body1">
                <strong>Applications Closed :</strong> {formatDate(job.applicationClosed)} {formatTime(job.applicationClosed)}
              </Typography>
            </Box>
          </Box>

          {/* Job Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <InfoRow>
                <Typography className="label">Form Link :</Typography>
                <Typography className="value">
                  {job.formLink ? (
                    <Link href={job.formLink} target="_blank" rel="noopener">
                      {job.formLink}
                    </Link>
                  ) : (
                    'Not provided'
                  )}
                </Typography>
              </InfoRow>

              <InfoRow>
                <Typography className="label">Handled By :</Typography>
                <Typography className="value">
                  <Link href="mailto:it.placements@dtu.ac.in" color="primary">
                    it.placements@dtu.ac.in
                  </Link>
                </Typography>
              </InfoRow>

              <InfoRow>
                <Typography className="label">Post :</Typography>
                <Typography className="value"></Typography>
              </InfoRow>

              <InfoRow>
                <Typography className="label">Job Description :</Typography>
                <Typography className="value">
                  {job.jobDescription ? (
                    <Link href={job.jobDescription} target="_blank" rel="noopener" sx={{ wordBreak: 'break-all' }}>
                      {job.jobDescription}
                    </Link>
                  ) : (
                    'Not provided'
                  )}
                </Typography>
              </InfoRow>

              <InfoRow>
                <Typography className="label">Stipend :</Typography>
                <Typography className="value">
                  {job.ctc ? `${job.ctc} per Month` : 'Not specified'}
                </Typography>
              </InfoRow>

              <InfoRow>
                <Typography className="label">12th Class Cutoff :</Typography>
                <Typography className="value">
                  {job.twelfthPercentageCutoff || 0} %
                </Typography>
              </InfoRow>

              <InfoRow>
                <Typography className="label">10th Class Cutoff :</Typography>
                <Typography className="value">
                  {job.tenthPercentageCutoff || 0} %
                </Typography>
              </InfoRow>

              <InfoRow>
                <Typography className="label">Number of Backlogs Allowed :</Typography>
                <Typography className="value">
                  {job.backlogsAllowed || 0}
                </Typography>
              </InfoRow>
            </CardContent>
          </Card>

          {/* Eligibility Table */}
          <Paper>
            <StyledTableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Programs Eligible</TableCell>
                    <TableCell>Cutoff</TableCell>
                    <TableCell>Branches</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eligibilityData.map((program) => (
                    <TableRow 
                      key={program.name}
                      className={program.eligible ? 'eligible' : 'not-eligible'}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {program.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {program.eligible ? program.cutoff : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {program.eligible ? (
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value="Eligibility"
                              displayEmpty
                              sx={{ 
                                '& .MuiSelect-select': { 
                                  padding: '8px 14px',
                                  fontSize: '0.875rem'
                                }
                              }}
                            >
                              <MenuItem value="Eligibility">Eligibility</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          <Chip 
                            label="Not Eligible" 
                            color="error" 
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Paper>
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
} 