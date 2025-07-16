'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api';
import { Application, ApplicationStatus } from '@/types';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
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
    minWidth: '100px',
    textAlign: 'center',
  };
});

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4caf50',
  color: 'white',
  padding: '8px 16px',
  fontSize: '12px',
  fontWeight: 'bold',
  borderRadius: '4px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#45a049',
  },
}));

const statusOptions = [
  { value: 'all', label: 'All Applications' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'NOT_SHORTLISTED', label: 'Not Shortlisted' },
  { value: 'SELECTED', label: 'Selected' },
  { value: 'REJECTED', label: 'Rejected' },
];

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('APPLIED');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<Application[]>('/student/applications');
      setApplications(data || []);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch applications');
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (selectedStatus === 'all') {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(app => app.status === selectedStatus);
      setFilteredApplications(filtered);
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleViewApplication = (applicationId: string) => {
    router.push(`/applications/${applicationId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
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
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            My Applications
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <StyledCard>
            <FilterContainer>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Filter
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FilterContainer>

            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#333' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                      Job Role
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                      Company
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {selectedStatus === 'all' 
                            ? 'No applications found' 
                            : `No applications with status "${getStatusLabel(selectedStatus)}"`
                          }
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {application.job.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {application.job.companyName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip 
                            label={getStatusLabel(application.status)}
                            status={application.status}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <ActionButton
                            onClick={() => handleViewApplication(application.id)}
                            size="small"
                          >
                            SEE MORE / CHANGE RESUME
                          </ActionButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledCard>
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
} 