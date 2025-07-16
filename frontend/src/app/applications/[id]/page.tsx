'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  IconButton,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter, useParams } from 'next/navigation';
import { ArrowBack } from '@mui/icons-material';
import { toast } from 'react-toastify';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api';
import { Application, Resume } from '@/types';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3),
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'APPLIED':
        return { backgroundColor: '#2196f3', color: 'white' };
      case 'SHORTLISTED':
        return { backgroundColor: '#ff9800', color: 'white' };
      case 'NOT_SHORTLISTED':
        return { backgroundColor: '#f44336', color: 'white' };
      case 'SELECTED':
        return { backgroundColor: '#4caf50', color: 'white' };
      case 'REJECTED':
        return { backgroundColor: '#757575', color: 'white' };
      default:
        return { backgroundColor: '#e0e0e0', color: 'black' };
    }
  };

  return {
    ...getStatusColor(),
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '8px 16px',
  };
});

const ResumeButton = styled(Button)<{ selected: boolean; resumeNumber: number }>(({ theme, selected, resumeNumber }) => ({
  width: '140px',
  height: '50px',
  borderRadius: '25px',
  fontWeight: 'bold',
  fontSize: '14px',
  textTransform: 'none',
  margin: theme.spacing(1),
  border: selected ? '3px solid #1976d2' : '2px solid #ccc',
  backgroundColor: selected ? '#1976d2' : 'white',
  color: selected ? 'white' : '#333',
  position: 'relative',
  '&:hover': {
    backgroundColor: selected ? '#1565c0' : '#f5f5f5',
    borderColor: '#1976d2',
  },
  '&::before': {
    content: `"${resumeNumber}"`,
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: selected ? 'white' : '#1976d2',
    color: selected ? '#1976d2' : 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
}));

const UpdateButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ccc',
  color: 'white',
  padding: '12px 40px',
  fontSize: '16px',
  fontWeight: 'bold',
  borderRadius: '6px',
  textTransform: 'none',
  marginTop: theme.spacing(3),
  '&:not(:disabled)': {
    backgroundColor: '#1976d2',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
}));

export default function ApplicationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
      fetchResumes();
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      const data = await apiClient.get<Application>(`/student/applications/${applicationId}`);
      setApplication(data);
      setSelectedResumeId(data.selectedResume?.id || '');
    } catch (error: any) {
      setError(error.message || 'Failed to fetch application details');
      toast.error('Failed to fetch application details');
    }
  };

  const fetchResumes = async () => {
    try {
      const data = await apiClient.get<Resume[]>('/student/resumes');
      setResumes(data || []);
    } catch (error: any) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSelect = (resumeId: string) => {
    setSelectedResumeId(resumeId);
  };

  const handleUpdateResume = async () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume');
      return;
    }

    try {
      setUpdating(true);
      
      // Call the backend API to update the resume
      await apiClient.patch(`/student/applications/${applicationId}/resume`, {
        selectedResumeId: selectedResumeId,
      });
      
      toast.success('Resume updated successfully!');
      
      // Refresh application details
      await fetchApplicationDetails();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update resume');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'Applied';
      case 'SHORTLISTED': return 'Shortlisted';
      case 'NOT_SHORTLISTED': return 'Not Shortlisted';
      case 'SELECTED': return 'Selected';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
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

  if (error || !application) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              {error || 'Application not found'}
            </Alert>
          </Box>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const hasChanges = selectedResumeId !== (application.selectedResume?.id || '');

  return (
    <ProtectedRoute>
      <MainLayout>
        <Box sx={{ p: 3 }}>
          {/* Back Button */}
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
              sx={{
                backgroundColor: '#333',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              BACK
            </Button>
          </Box>

          {/* Job Details */}
          <StyledCard>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Job Post: {application.job.name}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                  Company: {application.job.companyName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Submitted On:</strong> {formatDate(application.appliedAt)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Status: <StatusChip label={getStatusLabel(application.status)} status={application.status} />
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: '#333',
                    color: 'white',
                    borderColor: '#333',
                    '&:hover': {
                      backgroundColor: '#555',
                      borderColor: '#555',
                    },
                  }}
                >
                  SEE PROGRESS
                </Button>
              </Grid>
            </Grid>
          </StyledCard>

          {/* Selected Resume Section */}
          <StyledCard>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Selected Resume
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              {[1, 2, 3].map((resumeNumber) => {
                const resume = resumes[resumeNumber - 1];
                const isSelected = resume && selectedResumeId === resume.id;
                const isCurrentlySelected = resume && application.selectedResume?.id === resume.id;
                
                return (
                  <ResumeButton
                    key={resumeNumber}
                    selected={isSelected}
                    resumeNumber={resumeNumber}
                    onClick={() => resume && handleResumeSelect(resume.id)}
                    disabled={!resume}
                  >
                    Resume {resumeNumber}
                    {isCurrentlySelected && (
                      <Box component="span" sx={{ fontSize: '10px', display: 'block' }}>
                        (Current)
                      </Box>
                    )}
                  </ResumeButton>
                );
              })}
            </Box>

            {/* Currently Selected Resume Info */}
            {application.selectedResume && (
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Currently Selected: {application.selectedResume.originalName}
                </Typography>
              </Box>
            )}

            {/* Available Resumes Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                You have {resumes.length} resume(s) uploaded. 
                {resumes.length < 3 && ` You can upload ${3 - resumes.length} more resume(s).`}
              </Typography>
            </Box>
          </StyledCard>

          {/* Content Section */}
          <StyledCard>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Content :
            </Typography>
            
            <Box sx={{ minHeight: '100px', p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
              {application.job.jobDescription ? (
                <Typography variant="body2">
                  {application.job.jobDescription}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No additional content available for this application.
                </Typography>
              )}
            </Box>

            {/* Update Button */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <UpdateButton
                onClick={handleUpdateResume}
                disabled={!hasChanges || updating}
              >
                {updating ? <CircularProgress size={20} color="inherit" /> : 'UPDATE'}
              </UpdateButton>
            </Box>
          </StyledCard>
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
} 