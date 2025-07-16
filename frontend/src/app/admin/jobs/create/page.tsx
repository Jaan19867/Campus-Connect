'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  OutlinedInput,
  LinearProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Business,
  Work,
  LocationOn,
  Schedule,
  School,
  AttachMoney,
} from '@mui/icons-material';
import AdminLayout from '@/components/Layout/AdminLayout';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { adminApi } from '@/lib/adminApi';

interface JobFormData {
  // Basic Information
  name: string;
  company: string;
  jobType: 'fte' | 'internship' | 'contract';
  location: string;
  ctc: number;
  ctcCutoff: number;
  
  // Application Details
  applicationOpen: string;
  applicationClosed: string;
  status: 'open' | 'closed' | 'draft';
  gradYear: string;
  
  // Eligibility Criteria
  psu: boolean;
  genderOpen: 'Male' | 'Female' | 'Both';
  pwdOnly: boolean;
  openForPlaced: boolean;
  backlogsAllowed: number;
  
  // Academic Requirements
  tenthPercentageCutoff: number;
  twelfthPercentageCutoff: number;
  undergraduatePercentageCutoff: number;
  
  // Degree Programs
  btech: boolean;
  btechCutoff: number;
  btechBranches: number[];
  mtech: boolean;
  mtechCutoff: number;
  mtechBranches: number[];
  mba: boolean;
  mbaCutoff: number;
  mbaBranches: number[];
  bdes: boolean;
  bdesCutoff: number;
  mdes: boolean;
  mdesCutoff: number;
  ba: boolean;
  baCutoff: number;
  ma: boolean;
  maCutoff: number;
  bba: boolean;
  bbaCutoff: number;
  msc: boolean;
  mscBranches: number[];
  mscCutoff: number;
  
  // Additional Information
  jobDescription: string;
  formLink: string;
  postData: string;
  drive: string;
}

const branchOptions = [
  { id: 1, name: 'Computer Science Engineering' },
  { id: 2, name: 'Information Technology' },
  { id: 3, name: 'Electronics & Communication' },
  { id: 4, name: 'Electrical Engineering' },
  { id: 5, name: 'Mechanical Engineering' },
  { id: 6, name: 'Civil Engineering' },
  { id: 7, name: 'Chemical Engineering' },
  { id: 8, name: 'Biotechnology' },
  { id: 9, name: 'Aerospace Engineering' },
  { id: 10, name: 'Metallurgical Engineering' },
  { id: 11, name: 'Industrial Engineering' },
  { id: 12, name: 'Textile Engineering' },
  { id: 13, name: 'Food Technology' },
  { id: 14, name: 'Production Engineering' },
  { id: 15, name: 'Mining Engineering' },
  { id: 16, name: 'Petroleum Engineering' },
  { id: 17, name: 'Agricultural Engineering' },
  { id: 18, name: 'Environmental Engineering' },
  { id: 19, name: 'Instrumentation Engineering' },
  { id: 20, name: 'Robotics Engineering' },
  { id: 21, name: 'Data Science' },
];

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    // Basic Information
    name: '',
    company: '',
    jobType: 'fte',
    location: '',
    ctc: 0,
    ctcCutoff: 0,
    
    // Application Details
    applicationOpen: '',
    applicationClosed: '',
    status: 'open',
    gradYear: '2026',
    
    // Eligibility Criteria
    psu: false,
    genderOpen: 'Both',
    pwdOnly: false,
    openForPlaced: false,
    backlogsAllowed: 0,
    
    // Academic Requirements
    tenthPercentageCutoff: 0,
    twelfthPercentageCutoff: 0,
    undergraduatePercentageCutoff: 0,
    
    // Degree Programs
    btech: true,
    btechCutoff: 0,
    btechBranches: [],
    mtech: false,
    mtechCutoff: 0,
    mtechBranches: [],
    mba: false,
    mbaCutoff: 0,
    mbaBranches: [],
    bdes: false,
    bdesCutoff: 0,
    mdes: false,
    mdesCutoff: 0,
    ba: false,
    baCutoff: 0,
    ma: false,
    maCutoff: 0,
    bba: false,
    bbaCutoff: 0,
    msc: false,
    mscBranches: [],
    mscCutoff: 0,
    
    // Additional Information
    jobDescription: '',
    formLink: '',
    postData: '',
    drive: '',
  });

  const handleInputChange = (field: keyof JobFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (field: keyof JobFormData) => (
    event: any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: keyof JobFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const handleBranchChange = (degreeType: string, branches: number[]) => {
    setFormData(prev => ({
      ...prev,
      [`${degreeType}Branches`]: branches,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Job name is required');
      return false;
    }
    if (!formData.company.trim()) {
      toast.error('Company name is required');
      return false;
    }
    if (!formData.location.trim()) {
      toast.error('Location is required');
      return false;
    }
    if (!formData.applicationOpen) {
      toast.error('Application open date is required');
      return false;
    }
    if (!formData.applicationClosed) {
      toast.error('Application close date is required');
      return false;
    }
    if (formData.ctc <= 0) {
      toast.error('CTC must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // Map formData to backend DTO
      const companyObj: any = { 
        name: formData.company,
        _id: `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Generate unique ID
      };
      const payload = {
        ...formData,
        company: companyObj,
        status: formData.status,
        jobType: formData.jobType,
        gradYear: formData.gradYear,
        applicationOpen: formData.applicationOpen,
        applicationClosed: formData.applicationClosed,
        ctc: Number(formData.ctc),
        ctcCutoff: Number(formData.ctcCutoff),
        tenthPercentageCutoff: Number(formData.tenthPercentageCutoff),
        twelfthPercentageCutoff: Number(formData.twelfthPercentageCutoff),
        undergraduatePercentageCutoff: Number(formData.undergraduatePercentageCutoff),
        btechCutoff: Number(formData.btechCutoff),
        mtechCutoff: Number(formData.mtechCutoff),
        mbaCutoff: Number(formData.mbaCutoff),
        bdesCutoff: Number(formData.bdesCutoff),
        mdesCutoff: Number(formData.mdesCutoff),
        baCutoff: Number(formData.baCutoff),
        maCutoff: Number(formData.maCutoff),
        bbaCutoff: Number(formData.bbaCutoff),
        mscCutoff: Number(formData.mscCutoff),
        btechBranches: formData.btechBranches,
        mtechBranches: formData.mtechBranches,
        mbaBranches: formData.mbaBranches,
        mscBranches: formData.mscBranches,
      };
      // Call the real API
      await adminApi.post('/placement-cell/jobs', payload);
      toast.success('Job posted successfully!');
      router.push('/admin/jobs');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout title="Create New Job">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Create New Job Posting
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => router.push('/admin/jobs')}
                  >
                    Back to Jobs
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Fill in all the required details to create a new job posting
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Form */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                    Basic Information
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        required
                        InputProps={{
                          startAdornment: <Work sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        value={formData.company}
                        onChange={handleInputChange('company')}
                        required
                        InputProps={{
                          startAdornment: <Business sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Job Type</InputLabel>
                        <Select
                          value={formData.jobType}
                          label="Job Type"
                          onChange={handleSelectChange('jobType')}
                        >
                          <MenuItem value="fte">Full Time</MenuItem>
                          <MenuItem value="internship">Internship</MenuItem>
                          <MenuItem value="contract">Contract</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={formData.location}
                        onChange={handleInputChange('location')}
                        required
                        InputProps={{
                          startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="CTC (in LPA)"
                        type="number"
                        value={formData.ctc}
                        onChange={handleInputChange('ctc')}
                        required
                        InputProps={{
                          startAdornment: <AttachMoney sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Application Details */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                    Application Details
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Application Open Date"
                        type="datetime-local"
                        value={formData.applicationOpen}
                        onChange={handleInputChange('applicationOpen')}
                        required
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: <Schedule sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Application Close Date"
                        type="datetime-local"
                        value={formData.applicationClosed}
                        onChange={handleInputChange('applicationClosed')}
                        required
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: <Schedule sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.status}
                          label="Status"
                          onChange={handleSelectChange('status')}
                        >
                          <MenuItem value="open">Open</MenuItem>
                          <MenuItem value="closed">Closed</MenuItem>
                          <MenuItem value="draft">Draft</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Graduation Year"
                        value={formData.gradYear}
                        onChange={handleInputChange('gradYear')}
                        required
                        InputProps={{
                          startAdornment: <School sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="CTC Cutoff (in LPA)"
                        type="number"
                        value={formData.ctcCutoff}
                        onChange={handleInputChange('ctcCutoff')}
                        InputProps={{
                          startAdornment: <AttachMoney sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Eligibility Criteria */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                    Eligibility Criteria
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.psu}
                            onChange={handleCheckboxChange('psu')}
                          />
                        }
                        label="PSU"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.pwdOnly}
                            onChange={handleCheckboxChange('pwdOnly')}
                          />
                        }
                        label="PWD Only"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.openForPlaced}
                            onChange={handleCheckboxChange('openForPlaced')}
                          />
                        }
                        label="Open for Placed Students"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={formData.genderOpen}
                          label="Gender"
                          onChange={handleSelectChange('genderOpen')}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Both">Both</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Backlogs Allowed"
                        type="number"
                        value={formData.backlogsAllowed}
                        onChange={handleInputChange('backlogsAllowed')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Undergraduate Percentage Cutoff"
                        type="number"
                        value={formData.undergraduatePercentageCutoff}
                        onChange={handleInputChange('undergraduatePercentageCutoff')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="10th Percentage Cutoff"
                        type="number"
                        value={formData.tenthPercentageCutoff}
                        onChange={handleInputChange('tenthPercentageCutoff')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="12th Percentage Cutoff"
                        type="number"
                        value={formData.twelfthPercentageCutoff}
                        onChange={handleInputChange('twelfthPercentageCutoff')}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Degree Programs */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                    Degree Programs
                  </Typography>
                  
                  {/* BTech */}
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.btech}
                          onChange={handleCheckboxChange('btech')}
                        />
                      }
                      label="BTech"
                    />
                    {formData.btech && (
                      <Grid container spacing={2} sx={{ ml: 4, mt: 1 }}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="BTech CGPA Cutoff"
                            type="number"
                            value={formData.btechCutoff}
                            onChange={handleInputChange('btechCutoff')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>BTech Branches</InputLabel>
                            <Select
                              multiple
                              value={formData.btechBranches}
                              onChange={(e) => handleBranchChange('btech', e.target.value as number[])}
                              input={<OutlinedInput label="BTech Branches" />}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip 
                                      key={value} 
                                      label={branchOptions.find(b => b.id === value)?.name || value} 
                                      size="small" 
                                    />
                                  ))}
                                </Box>
                              )}
                            >
                              {branchOptions.map((branch) => (
                                <MenuItem key={branch.id} value={branch.id}>
                                  {branch.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    )}
                  </Box>

                  {/* MTech */}
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.mtech}
                          onChange={handleCheckboxChange('mtech')}
                        />
                      }
                      label="MTech"
                    />
                    {formData.mtech && (
                      <Grid container spacing={2} sx={{ ml: 4, mt: 1 }}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="MTech CGPA Cutoff"
                            type="number"
                            value={formData.mtechCutoff}
                            onChange={handleInputChange('mtechCutoff')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>MTech Branches</InputLabel>
                            <Select
                              multiple
                              value={formData.mtechBranches}
                              onChange={(e) => handleBranchChange('mtech', e.target.value as number[])}
                              input={<OutlinedInput label="MTech Branches" />}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip 
                                      key={value} 
                                      label={branchOptions.find(b => b.id === value)?.name || value} 
                                      size="small" 
                                    />
                                  ))}
                                </Box>
                              )}
                            >
                              {branchOptions.map((branch) => (
                                <MenuItem key={branch.id} value={branch.id}>
                                  {branch.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    )}
                  </Box>

                  {/* Other Programs */}
                  <Grid container spacing={2} sx={{ ml: 4 }}>
                    {[
                      { key: 'mba', label: 'MBA' },
                      { key: 'bdes', label: 'BDes' },
                      { key: 'mdes', label: 'MDes' },
                      { key: 'ba', label: 'BA' },
                      { key: 'ma', label: 'MA' },
                      { key: 'bba', label: 'BBA' },
                      { key: 'msc', label: 'MSc' },
                    ].map((program) => (
                      <Grid item xs={12} md={6} key={program.key}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData[program.key as keyof JobFormData] as boolean}
                              onChange={handleCheckboxChange(program.key as keyof JobFormData)}
                            />
                          }
                          label={program.label}
                        />
                        {formData[program.key as keyof JobFormData] as boolean && (
                          <TextField
                            fullWidth
                            label={`${program.label} Cutoff`}
                            type="number"
                            value={formData[`${program.key}Cutoff` as keyof JobFormData] as number}
                            onChange={handleInputChange(`${program.key}Cutoff` as keyof JobFormData)}
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Additional Information */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                    Additional Information
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Job Description URL"
                        value={formData.jobDescription}
                        onChange={handleInputChange('jobDescription')}
                        placeholder="https://drive.google.com/..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Application Form Link"
                        value={formData.formLink}
                        onChange={handleInputChange('formLink')}
                        placeholder="https://forms.google.com/..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Drive Link"
                        value={formData.drive}
                        onChange={handleInputChange('drive')}
                        placeholder="https://drive.google.com/..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Post Content"
                        multiline
                        rows={6}
                        value={formData.postData}
                        onChange={handleInputChange('postData')}
                        placeholder="Enter the detailed post content..."
                      />
                    </Grid>
                  </Grid>

                  {/* Submit Button */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => router.push('/admin/jobs')}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <LinearProgress /> : <Save />}
                      disabled={loading}
                      sx={{ bgcolor: '#1976d2' }}
                    >
                      {loading ? 'Posting Job...' : 'Post Job'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </AdminLayout>
    </AdminProtectedRoute>
  );
} 