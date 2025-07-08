'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Lock,
  Upload,
  Visibility,
  Delete,
  Close,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api';
import { Resume } from '@/types';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  border: '2px dashed #ddd',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#1976d2',
    backgroundColor: '#f0f7ff',
  },
}));

const ResumeSlot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasResume',
})(({ theme, hasResume }: { theme?: any; hasResume: boolean }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: theme.spacing(2),
  backgroundColor: hasResume ? '#f8f9fa' : 'transparent',
  borderRadius: '8px',
}));

const SelectButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  border: '1px solid #1976d2',
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: 'bold',
  borderRadius: '6px',
  textTransform: 'none',
  minWidth: '200px',
  '&:hover': {
    backgroundColor: '#bbdefb',
  },
}));

const ViewButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#000',
  color: 'white',
  padding: '8px 24px',
  fontSize: '14px',
  fontWeight: 'bold',
  borderRadius: '6px',
  textTransform: 'none',
  minWidth: '80px',
  '&:hover': {
    backgroundColor: '#333',
  },
}));

const HiddenFileInput = styled('input')({
  display: 'none',
});

interface ResumeSlotData {
  id: number;
  resume: Resume | null;
  uploading: boolean;
}

export default function ResumePage() {
  const [resumeSlots, setResumeSlots] = useState<ResumeSlotData[]>([
    { id: 1, resume: null, uploading: false },
    { id: 2, resume: null, uploading: false },
    { id: 3, resume: null, uploading: false },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResumeForDelete, setSelectedResumeForDelete] = useState<Resume | null>(null);
  
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const resumes = await apiClient.get<Resume[]>('/student/resumes');
      
      // Map resumes to slots (first 3 resumes)
      const newSlots = resumeSlots.map((slot, index) => ({
        ...slot,
        resume: resumes[index] || null,
        uploading: false,
      }));
      
      setResumeSlots(newSlots);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch resumes');
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (slotId: number) => {
    const fileInput = fileInputRefs[slotId - 1];
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, slotId: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, DOC, and DOCX files are allowed');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should not exceed 2 MB');
      return;
    }

    try {
      // Set uploading state
      setResumeSlots(prev => prev.map(slot => 
        slot.id === slotId ? { ...slot, uploading: true } : slot
      ));

      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadedResume = await apiClient.uploadFile<Resume>('/student/resumes/upload', file);
      
      // Update slot with new resume
      setResumeSlots(prev => prev.map(slot => 
        slot.id === slotId ? { ...slot, resume: uploadedResume, uploading: false } : slot
      ));

      toast.success('Resume uploaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload resume');
      setResumeSlots(prev => prev.map(slot => 
        slot.id === slotId ? { ...slot, uploading: false } : slot
      ));
    }

    // Reset file input
    event.target.value = '';
  };

  const handleViewResume = async (resume: Resume) => {
    try {
      // Download file with authentication
      const blob = await apiClient.downloadFile(`/student/resumes/${resume.id}`);
      
      // Create object URL and open in new tab
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      // Clean up object URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 10000);
      
      if (!newWindow) {
        toast.error('Popup blocked. Please allow popups for this site.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to open resume');
    }
  };

  const handleDeleteClick = (resume: Resume) => {
    setSelectedResumeForDelete(resume);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResumeForDelete) return;

    try {
      await apiClient.delete(`/student/resumes/${selectedResumeForDelete.id}`);
      
      // Remove resume from slot
      setResumeSlots(prev => prev.map(slot => 
        slot.resume?.id === selectedResumeForDelete.id 
          ? { ...slot, resume: null } 
          : slot
      ));

      toast.success('Resume deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete resume');
    }

    setDeleteDialogOpen(false);
    setSelectedResumeForDelete(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        <Box sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              My Resume
            </Typography>
            <Lock sx={{ fontSize: 32, color: 'text.secondary' }} />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Resume Slots */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {resumeSlots.map((slot) => (
              <Grid item xs={12} key={slot.id}>
                <StyledCard>
                  <CardContent sx={{ width: '100%', p: 2, '&:last-child': { pb: 2 } }}>
                    <ResumeSlot hasResume={!!slot.resume}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', minWidth: '20px' }}>
                          {slot.id}.
                        </Typography>
                        
                        {slot.uploading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={20} />
                            <Typography variant="body1">Uploading...</Typography>
                          </Box>
                        ) : slot.resume ? (
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                              {slot.resume.originalName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatFileSize(slot.resume.fileSize)} • Uploaded {new Date(slot.resume.uploadedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        ) : (
                          <SelectButton
                            variant="outlined"
                            startIcon={<Upload />}
                            onClick={() => handleFileSelect(slot.id)}
                          >
                            SELECT YOUR RESUME {slot.id}
                          </SelectButton>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {slot.resume && (
                          <>
                            <ViewButton
                              variant="contained"
                              onClick={() => handleViewResume(slot.resume!)}
                            >
                              VIEW
                            </ViewButton>
                            <IconButton
                              onClick={() => handleDeleteClick(slot.resume!)}
                              sx={{ color: 'error.main' }}
                            >
                              <Delete />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </ResumeSlot>

                    {/* Hidden file input */}
                    <HiddenFileInput
                      ref={fileInputRefs[slot.id - 1]}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, slot.id)}
                    />
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          {/* Note */}
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '16px' }}>
            Note - Size of your resume file should not be more than 2 MB
          </Typography>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Delete Resume
                <IconButton onClick={() => setDeleteDialogOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete "{selectedResumeForDelete?.originalName}"? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
} 