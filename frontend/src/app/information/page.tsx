'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api';
import { 
  Student, 
  Gender, 
  StudentLanguage, 
  StudentTechnicalSkill, 
  StudentOtherSkill, 
  StudentResponsibility, 
  StudentProjectLink 
} from '@/types';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

interface PersonalFormData {
  firstName: string;
  lastName: string;
  email: string;
  personalEmail: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: Gender | '';
  citizenship: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  category: string;
  debarred: boolean;
  currentAddressLine1: string;
  currentAddressLine2: string;
  currentAddressState: string;
  currentAddressPostalCode: string;
  permanentAddressLine1: string;
  permanentAddressLine2: string;
  permanentAddressState: string;
  permanentAddressPostalCode: string;
}

interface AcademicFormData {
  // College Transcript
  course: string;
  branch: string;
  currentYear: string;
  yearOfGraduation: string;
  gpa: string;
  cgpa: string;
  backlogSubjects: string;
  // Semester-wise CGPA
  semester1Cgpa: string;
  semester2Cgpa: string;
  semester3Cgpa: string;
  semester4Cgpa: string;
  semester5Cgpa: string;
  semester6Cgpa: string;
  semester7Cgpa: string;
  semester8Cgpa: string;
  // Entrance Exam
  entranceExam: string;
  entranceRank: string;
  entranceCategory: string;
  // XIIth Standard
  twelfthSchoolName: string;
  twelfthBoard: string;
  twelfthMarks: string;
  twelfthYearOfPassing: string;
  twelfthSubjects: string;
  // Xth Standard
  tenthSchoolName: string;
  tenthBoard: string;
  tenthMarks: string;
  tenthYearOfPassing: string;
  tenthSubjects: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function InformationPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [languages, setLanguages] = useState<StudentLanguage[]>([]);
  const [newLanguage, setNewLanguage] = useState('');
  
  // Skills state
  const [technicalSkills, setTechnicalSkills] = useState<StudentTechnicalSkill[]>([]);
  const [otherSkills, setOtherSkills] = useState<StudentOtherSkill[]>([]);
  const [responsibilities, setResponsibilities] = useState<StudentResponsibility[]>([]);
  const [projectLinks, setProjectLinks] = useState<StudentProjectLink[]>([]);
  const [certificatesLink, setCertificatesLink] = useState('');
  
  // New skill input states
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newOtherSkill, setNewOtherSkill] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newProjectLink, setNewProjectLink] = useState('');
  
  // Personal Information Form State
  const [personalFormData, setPersonalFormData] = useState<PersonalFormData>({
    firstName: '',
    lastName: '',
    email: '',
    personalEmail: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    citizenship: '',
    fatherName: '',
    motherName: '',
    guardianName: '',
    category: '',
    debarred: false,
    currentAddressLine1: '',
    currentAddressLine2: '',
    currentAddressState: '',
    currentAddressPostalCode: '',
    permanentAddressLine1: '',
    permanentAddressLine2: '',
    permanentAddressState: '',
    permanentAddressPostalCode: '',
  });

  // Academic Information Form State
  const [academicFormData, setAcademicFormData] = useState<AcademicFormData>({
    course: '',
    branch: '',
    currentYear: '',
    yearOfGraduation: '',
    gpa: '',
    cgpa: '',
    backlogSubjects: '',
    semester1Cgpa: '',
    semester2Cgpa: '',
    semester3Cgpa: '',
    semester4Cgpa: '',
    semester5Cgpa: '',
    semester6Cgpa: '',
    semester7Cgpa: '',
    semester8Cgpa: '',
    entranceExam: '',
    entranceRank: '',
    entranceCategory: '',
    twelfthSchoolName: '',
    twelfthBoard: '',
    twelfthMarks: '',
    twelfthYearOfPassing: '',
    twelfthSubjects: '',
    tenthSchoolName: '',
    tenthBoard: '',
    tenthMarks: '',
    tenthYearOfPassing: '',
    tenthSubjects: '',
  });

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Student>('/student/my-information/profile');
      setStudent(response);
      
      // Initialize form data with current values
      setPersonalFormData({
        firstName: response.firstName || '',
        lastName: response.lastName || '',
        email: response.email || '',
        personalEmail: response.personalEmail || '',
        phoneNumber: response.phoneNumber || '',
        dateOfBirth: response.dateOfBirth ? response.dateOfBirth.split('T')[0] : '',
        gender: response.gender || '',
        citizenship: response.citizenship || '',
        fatherName: response.fatherName || '',
        motherName: response.motherName || '',
        guardianName: response.guardianName || '',
        category: response.category || '',
        debarred: response.debarred || false,
        currentAddressLine1: response.currentAddressLine1 || '',
        currentAddressLine2: response.currentAddressLine2 || '',
        currentAddressState: response.currentAddressState || '',
        currentAddressPostalCode: response.currentAddressPostalCode || '',
        permanentAddressLine1: response.permanentAddressLine1 || '',
        permanentAddressLine2: response.permanentAddressLine2 || '',
        permanentAddressState: response.permanentAddressState || '',
        permanentAddressPostalCode: response.permanentAddressPostalCode || '',
      });
      
      // Initialize academic form data
      setAcademicFormData({
        course: response.course || '',
        branch: response.branch || '',
        currentYear: response.currentYear?.toString() || '',
        yearOfGraduation: response.yearOfGraduation || '',
        gpa: response.gpa?.toString() || '',
        cgpa: response.cgpa?.toString() || '',
        backlogSubjects: response.backlogSubjects?.toString() || '',
        semester1Cgpa: response.semester1Cgpa?.toString() || '',
        semester2Cgpa: response.semester2Cgpa?.toString() || '',
        semester3Cgpa: response.semester3Cgpa?.toString() || '',
        semester4Cgpa: response.semester4Cgpa?.toString() || '',
        semester5Cgpa: response.semester5Cgpa?.toString() || '',
        semester6Cgpa: response.semester6Cgpa?.toString() || '',
        semester7Cgpa: response.semester7Cgpa?.toString() || '',
        semester8Cgpa: response.semester8Cgpa?.toString() || '',
        entranceExam: response.entranceExam || '',
        entranceRank: response.entranceRank || '',
        entranceCategory: response.entranceCategory || '',
        twelfthSchoolName: response.twelfthSchoolName || '',
        twelfthBoard: response.twelfthBoard || '',
        twelfthMarks: response.twelfthMarks?.toString() || '',
        twelfthYearOfPassing: response.twelfthYearOfPassing || '',
        twelfthSubjects: response.twelfthSubjects || '',
        tenthSchoolName: response.tenthSchoolName || '',
        tenthBoard: response.tenthBoard || '',
        tenthMarks: response.tenthMarks?.toString() || '',
        tenthYearOfPassing: response.tenthYearOfPassing || '',
        tenthSubjects: response.tenthSubjects || '',
      });
      
      // Set languages
      if (response.languages) {
        setLanguages(response.languages);
      }
      
      // Fetch skills
      const technicalSkillsResponse = await apiClient.get<StudentTechnicalSkill[]>('/student/my-information/technical-skills');
      setTechnicalSkills(technicalSkillsResponse || []);
      
      const otherSkillsResponse = await apiClient.get<StudentOtherSkill[]>('/student/my-information/other-skills');
      setOtherSkills(otherSkillsResponse || []);
      
      const responsibilitiesResponse = await apiClient.get<StudentResponsibility[]>('/student/my-information/responsibilities');
      setResponsibilities(responsibilitiesResponse || []);
      
      const projectLinksResponse = await apiClient.get<StudentProjectLink[]>('/student/my-information/project-links');
      setProjectLinks(projectLinksResponse || []);
      
      // Set certificates link from student profile
      setCertificatesLink(response.certificatesLink || '');
      
    } catch (error: any) {
      setError(error.message || 'Failed to fetch profile');
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handlePersonalFormChange = (field: keyof PersonalFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPersonalFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleAcademicFormChange = (field: keyof AcademicFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAcademicFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handlePersonalFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      setUpdating(true);
      const response = await apiClient.put('/student/my-information/personal', personalFormData);
      
      // Update student state with new data - convert form data to match Student interface
      const updatedData = {
        ...personalFormData,
        gender: personalFormData.gender === '' ? undefined : personalFormData.gender,
      };
      
      setStudent(prev => prev ? { ...prev, ...updatedData } : null);
      
      toast.success('Personal information updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update personal information');
    } finally {
      setUpdating(false);
    }
  };

  const handleAcademicFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      setUpdating(true);
      
      // Convert string values to appropriate types
      const academicData = {
        course: academicFormData.course || undefined,
        branch: academicFormData.branch || undefined,
        currentYear: academicFormData.currentYear ? parseInt(academicFormData.currentYear) : undefined,
        yearOfGraduation: academicFormData.yearOfGraduation || undefined,
        gpa: academicFormData.gpa ? parseFloat(academicFormData.gpa) : undefined,
        cgpa: academicFormData.cgpa ? parseFloat(academicFormData.cgpa) : undefined,
        backlogSubjects: academicFormData.backlogSubjects ? parseInt(academicFormData.backlogSubjects) : undefined,
        semester1Cgpa: academicFormData.semester1Cgpa ? parseFloat(academicFormData.semester1Cgpa) : undefined,
        semester2Cgpa: academicFormData.semester2Cgpa ? parseFloat(academicFormData.semester2Cgpa) : undefined,
        semester3Cgpa: academicFormData.semester3Cgpa ? parseFloat(academicFormData.semester3Cgpa) : undefined,
        semester4Cgpa: academicFormData.semester4Cgpa ? parseFloat(academicFormData.semester4Cgpa) : undefined,
        semester5Cgpa: academicFormData.semester5Cgpa ? parseFloat(academicFormData.semester5Cgpa) : undefined,
        semester6Cgpa: academicFormData.semester6Cgpa ? parseFloat(academicFormData.semester6Cgpa) : undefined,
        semester7Cgpa: academicFormData.semester7Cgpa ? parseFloat(academicFormData.semester7Cgpa) : undefined,
        semester8Cgpa: academicFormData.semester8Cgpa ? parseFloat(academicFormData.semester8Cgpa) : undefined,
        entranceExam: academicFormData.entranceExam || undefined,
        entranceRank: academicFormData.entranceRank || undefined,
        entranceCategory: academicFormData.entranceCategory || undefined,
        twelfthSchoolName: academicFormData.twelfthSchoolName || undefined,
        twelfthBoard: academicFormData.twelfthBoard || undefined,
        twelfthMarks: academicFormData.twelfthMarks ? parseFloat(academicFormData.twelfthMarks) : undefined,
        twelfthYearOfPassing: academicFormData.twelfthYearOfPassing || undefined,
        twelfthSubjects: academicFormData.twelfthSubjects || undefined,
        tenthSchoolName: academicFormData.tenthSchoolName || undefined,
        tenthBoard: academicFormData.tenthBoard || undefined,
        tenthMarks: academicFormData.tenthMarks ? parseFloat(academicFormData.tenthMarks) : undefined,
        tenthYearOfPassing: academicFormData.tenthYearOfPassing || undefined,
        tenthSubjects: academicFormData.tenthSubjects || undefined,
      };
      
      const response = await apiClient.put('/student/my-information/academic', academicData);
      
      // Refresh the entire profile to get updated data
      await fetchStudentProfile();
      
      toast.success('Academic information updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update academic information');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddLanguage = async () => {
    if (!newLanguage.trim()) return;
    
    try {
      const response = await apiClient.post<StudentLanguage>('/student/my-information/languages', {
        language: newLanguage.trim(),
      });
      setLanguages(prev => [...prev, response]);
      setNewLanguage('');
      toast.success('Language added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add language');
    }
  };

  const handleDeleteLanguage = async (language: string) => {
    try {
      await apiClient.delete(`/student/my-information/languages/${encodeURIComponent(language)}`);
      setLanguages(prev => prev.filter(lang => lang.language !== language));
      toast.success('Language removed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove language');
    }
  };

  // Technical Skills Handlers
  const handleAddTechnicalSkill = async () => {
    if (!newTechnicalSkill.trim()) return;
    
    try {
      const response = await apiClient.post<StudentTechnicalSkill>('/student/my-information/technical-skills', {
        skill: newTechnicalSkill.trim(),
      });
      setTechnicalSkills(prev => [...prev, response]);
      setNewTechnicalSkill('');
      toast.success('Technical skill added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add technical skill');
    }
  };

  const handleDeleteTechnicalSkill = async (skill: string) => {
    try {
      await apiClient.delete(`/student/my-information/technical-skills/${encodeURIComponent(skill)}`);
      setTechnicalSkills(prev => prev.filter(s => s.skill !== skill));
      toast.success('Technical skill removed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove technical skill');
    }
  };

  // Other Skills Handlers
  const handleAddOtherSkill = async () => {
    if (!newOtherSkill.trim()) return;
    
    try {
      const response = await apiClient.post<StudentOtherSkill>('/student/my-information/other-skills', {
        skill: newOtherSkill.trim(),
      });
      setOtherSkills(prev => [...prev, response]);
      setNewOtherSkill('');
      toast.success('Other skill added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add other skill');
    }
  };

  const handleDeleteOtherSkill = async (skill: string) => {
    try {
      await apiClient.delete(`/student/my-information/other-skills/${encodeURIComponent(skill)}`);
      setOtherSkills(prev => prev.filter(s => s.skill !== skill));
      toast.success('Other skill removed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove other skill');
    }
  };

  // Responsibilities Handlers
  const handleAddResponsibility = async () => {
    if (!newResponsibility.trim()) return;
    
    try {
      const response = await apiClient.post<StudentResponsibility>('/student/my-information/responsibilities', {
        responsibility: newResponsibility.trim(),
      });
      setResponsibilities(prev => [...prev, response]);
      setNewResponsibility('');
      toast.success('Responsibility added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add responsibility');
    }
  };

  const handleDeleteResponsibility = async (responsibility: string) => {
    try {
      await apiClient.delete(`/student/my-information/responsibilities/${encodeURIComponent(responsibility)}`);
      setResponsibilities(prev => prev.filter(r => r.responsibility !== responsibility));
      toast.success('Responsibility removed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove responsibility');
    }
  };

  // Project Links Handlers
  const handleAddProjectLink = async () => {
    if (!newProjectLink.trim()) return;
    
    try {
      const response = await apiClient.post<StudentProjectLink>('/student/my-information/project-links', {
        projectLink: newProjectLink.trim(),
      });
      setProjectLinks(prev => [...prev, response]);
      setNewProjectLink('');
      toast.success('Project link added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add project link');
    }
  };

  const handleDeleteProjectLink = async (projectLink: string) => {
    try {
      await apiClient.delete(`/student/my-information/project-links/${encodeURIComponent(projectLink)}`);
      setProjectLinks(prev => prev.filter(pl => pl.projectLink !== projectLink));
      toast.success('Project link removed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove project link');
    }
  };

  // Certificates Link Handler
  const handleAddCertificatesLink = async () => {
    if (!certificatesLink.trim()) return;
    
    try {
      setUpdating(true);
      await apiClient.put('/student/my-information/certificates-link', {
        certificatesLink: certificatesLink.trim(),
      });
      toast.success('Certificates link added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add certificates link');
    } finally {
      setUpdating(false);
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

  if (error || !student) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              {error || 'Student profile not found'}
            </Alert>
          </Box>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            My Information
          </Typography>

          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="information tabs"
                >
                  <StyledTab label="Personal" {...a11yProps(0)} />
                  <StyledTab label="Academic" {...a11yProps(1)} />
                  <StyledTab label="Skills" {...a11yProps(2)} />
                </Tabs>
              </Box>

              {/* Personal Information Tab */}
              <TabPanel value={currentTab} index={0}>
                <StyledPaper elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Personal Information
                  </Typography>
                  
                  <form onSubmit={handlePersonalFormSubmit}>
                    <Grid container spacing={3}>
                      {/* Basic Information */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={personalFormData.firstName}
                          onChange={handlePersonalFormChange('firstName')}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={personalFormData.lastName}
                          onChange={handlePersonalFormChange('lastName')}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={personalFormData.email}
                          onChange={handlePersonalFormChange('email')}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Personal Email"
                          type="email"
                          value={personalFormData.personalEmail}
                          onChange={handlePersonalFormChange('personalEmail')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Mobile"
                          value={personalFormData.phoneNumber}
                          onChange={handlePersonalFormChange('phoneNumber')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth (YYYY-MM-DD)"
                          type="date"
                          value={personalFormData.dateOfBirth}
                          onChange={handlePersonalFormChange('dateOfBirth')}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={personalFormData.gender}
                            onChange={(e) => setPersonalFormData(prev => ({ ...prev, gender: e.target.value as Gender | '' }))}
                            label="Gender"
                          >
                            <MenuItem value="">Select Gender</MenuItem>
                            <MenuItem value={Gender.MALE}>Male</MenuItem>
                            <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                            <MenuItem value={Gender.OTHER}>Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Roll No"
                          value={student.rollNumber}
                          disabled
                          variant="outlined"
                          helperText="Roll number cannot be changed"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Citizenship"
                          value={personalFormData.citizenship}
                          onChange={handlePersonalFormChange('citizenship')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Father's Name"
                          value={personalFormData.fatherName}
                          onChange={handlePersonalFormChange('fatherName')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Mother's Name"
                          value={personalFormData.motherName}
                          onChange={handlePersonalFormChange('motherName')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Category"
                          value={personalFormData.category}
                          onChange={handlePersonalFormChange('category')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Guardian's Name"
                          value={personalFormData.guardianName}
                          onChange={handlePersonalFormChange('guardianName')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={personalFormData.debarred}
                              onChange={(e) => setPersonalFormData(prev => ({ ...prev, debarred: e.target.checked }))}
                            />
                          }
                          label="Debarred"
                        />
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 4 }} />
                    
                    {/* Current Address */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Current Address
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Line 1"
                          value={personalFormData.currentAddressLine1}
                          onChange={handlePersonalFormChange('currentAddressLine1')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Line 2"
                          value={personalFormData.currentAddressLine2}
                          onChange={handlePersonalFormChange('currentAddressLine2')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="State"
                          value={personalFormData.currentAddressState}
                          onChange={handlePersonalFormChange('currentAddressState')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          value={personalFormData.currentAddressPostalCode}
                          onChange={handlePersonalFormChange('currentAddressPostalCode')}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 4 }} />
                    
                    {/* Permanent Address */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Permanent Address
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Line 1"
                          value={personalFormData.permanentAddressLine1}
                          onChange={handlePersonalFormChange('permanentAddressLine1')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Line 2"
                          value={personalFormData.permanentAddressLine2}
                          onChange={handlePersonalFormChange('permanentAddressLine2')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="State"
                          value={personalFormData.permanentAddressState}
                          onChange={handlePersonalFormChange('permanentAddressState')}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          value={personalFormData.permanentAddressPostalCode}
                          onChange={handlePersonalFormChange('permanentAddressPostalCode')}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 4 }} />
                    
                    {/* Languages */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Languages
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                          <TextField
                            fullWidth
                            label="Add into Languages"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            variant="outlined"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddLanguage();
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Button
                            variant="contained"
                            onClick={handleAddLanguage}
                            disabled={!newLanguage.trim()}
                            sx={{ 
                              bgcolor: '#000',
                              color: 'white',
                              '&:hover': { bgcolor: '#333' }
                            }}
                          >
                            ADD
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      {languages.map((lang) => (
                        <Chip
                          key={lang.id}
                          label={lang.language}
                          deleteIcon={<Delete />}
                          onDelete={() => handleDeleteLanguage(lang.language)}
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={updating}
                        sx={{ 
                          bgcolor: '#000',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          '&:hover': { bgcolor: '#333' }
                        }}
                      >
                        {updating ? <CircularProgress size={20} /> : 'UPDATE'}
                      </Button>
                    </Box>
                  </form>
                </StyledPaper>
              </TabPanel>

              {/* Academic Information Tab */}
              <TabPanel value={currentTab} index={1}>
                <StyledPaper elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Academic Information
                  </Typography>
                  
                  <form onSubmit={handleAcademicFormSubmit}>
                    {/* College Transcript */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      College Transcript
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Course"
                          value={academicFormData.course}
                          onChange={handleAcademicFormChange('course')}
                          variant="outlined"
                          placeholder="BTech"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Branch"
                          value={academicFormData.branch}
                          onChange={handleAcademicFormChange('branch')}
                          variant="outlined"
                          placeholder="Software Engineering"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Year of Graduation"
                          value={academicFormData.yearOfGraduation}
                          onChange={handleAcademicFormChange('yearOfGraduation')}
                          variant="outlined"
                          placeholder="2026"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Aggregate CGPA"
                          type="number"
                          value={academicFormData.cgpa}
                          onChange={handleAcademicFormChange('cgpa')}
                          variant="outlined"
                          placeholder="7.16"
                          inputProps={{ step: 0.01, min: 0, max: 10 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Backlog Subjects"
                          type="number"
                          value={academicFormData.backlogSubjects}
                          onChange={handleAcademicFormChange('backlogSubjects')}
                          variant="outlined"
                          placeholder="0"
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                    </Grid>
                    
                    {/* Semester-wise CGPA */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                      Semester-wise CGPA
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Semester 1 CGPA"
                          type="number"
                          value={academicFormData.semester1Cgpa}
                          onChange={handleAcademicFormChange('semester1Cgpa')}
                          variant="outlined"
                          placeholder="6.3"
                          inputProps={{ step: 0.01, min: 0, max: 10 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Semester 2 CGPA"
                          type="number"
                          value={academicFormData.semester2Cgpa}
                          onChange={handleAcademicFormChange('semester2Cgpa')}
                          variant="outlined"
                          placeholder="7.18"
                          inputProps={{ step: 0.01, min: 0, max: 10 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Semester 3 CGPA"
                          type="number"
                          value={academicFormData.semester3Cgpa}
                          onChange={handleAcademicFormChange('semester3Cgpa')}
                          variant="outlined"
                          placeholder="7.91"
                          inputProps={{ step: 0.01, min: 0, max: 10 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Semester 4 CGPA"
                          type="number"
                          value={academicFormData.semester4Cgpa}
                          onChange={handleAcademicFormChange('semester4Cgpa')}
                          variant="outlined"
                          placeholder="0"
                          inputProps={{ step: 0.01, min: 0, max: 10 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Semester 5 CGPA"
                          type="number"
                          value={academicFormData.semester5Cgpa}
                          onChange={handleAcademicFormChange('semester5Cgpa')}
                          variant="outlined"
                          placeholder="0"
                          inputProps={{ step: 0.01, min: 0, max: 10 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Semester 6 CGPA"
                          type="number"
                          value={academicFormData.semester6Cgpa}
                          onChange={handleAcademicFormChange('semester6Cgpa')}
                          variant="outlined"
                          placeholder="0"
                          inputProps={{ step: 0.01, min: 0, max: 10 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Semester 7 CGPA"
                          type="number"
                          value={academicFormData.semester7Cgpa}
                          onChange={handleAcademicFormChange('semester7Cgpa')}
                          variant="outlined"
                          placeholder="0"
                          inputProps={{ step: 0.01, min: 0, max: 10 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Semester 8 CGPA"
                          type="number"
                          value={academicFormData.semester8Cgpa}
                          onChange={handleAcademicFormChange('semester8Cgpa')}
                          variant="outlined"
                          placeholder="0"
                          inputProps={{ step: 0.01, min: 0, max: 10 }}
                        />
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 4 }} />
                    
                    {/* Entrance Exam */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Entrance Exam
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Entrance Exam"
                          value={academicFormData.entranceExam}
                          onChange={handleAcademicFormChange('entranceExam')}
                          variant="outlined"
                          placeholder="JEE-Main"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Rank"
                          value={academicFormData.entranceRank}
                          onChange={handleAcademicFormChange('entranceRank')}
                          variant="outlined"
                          placeholder="65568"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Category"
                          value={academicFormData.entranceCategory}
                          onChange={handleAcademicFormChange('entranceCategory')}
                          variant="outlined"
                          placeholder="obc"
                        />
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 4 }} />
                    
                    {/* XIIth Standard */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      XIIth Standard
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="School Name"
                          value={academicFormData.twelfthSchoolName}
                          onChange={handleAcademicFormChange('twelfthSchoolName')}
                          variant="outlined"
                          placeholder="Green Valley International Public School Deepak Vihar Najfgarh"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Board"
                          value={academicFormData.twelfthBoard}
                          onChange={handleAcademicFormChange('twelfthBoard')}
                          variant="outlined"
                          placeholder="CBSE"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="CGPA/Percentage"
                          type="number"
                          value={academicFormData.twelfthMarks}
                          onChange={handleAcademicFormChange('twelfthMarks')}
                          variant="outlined"
                          placeholder="79.6"
                          inputProps={{ step: 0.01, min: 0, max: 100 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Year of Passing"
                          value={academicFormData.twelfthYearOfPassing}
                          onChange={handleAcademicFormChange('twelfthYearOfPassing')}
                          variant="outlined"
                          placeholder="2021"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subjects"
                          value={academicFormData.twelfthSubjects}
                          onChange={handleAcademicFormChange('twelfthSubjects')}
                          variant="outlined"
                          placeholder="English Core, Mathematics, Physics, Chemistry, Physical Education"
                        />
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 4 }} />
                    
                    {/* Xth Standard */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Xth Standard
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="School Name"
                          value={academicFormData.tenthSchoolName}
                          onChange={handleAcademicFormChange('tenthSchoolName')}
                          variant="outlined"
                          placeholder="Hemnani Public School"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Board"
                          value={academicFormData.tenthBoard}
                          onChange={handleAcademicFormChange('tenthBoard')}
                          variant="outlined"
                          placeholder="CBSE"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="CGPA/Percentage"
                          type="number"
                          value={academicFormData.tenthMarks}
                          onChange={handleAcademicFormChange('tenthMarks')}
                          variant="outlined"
                          placeholder="90"
                          inputProps={{ step: 0.01, min: 0, max: 100 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Year of Passing"
                          value={academicFormData.tenthYearOfPassing}
                          onChange={handleAcademicFormChange('tenthYearOfPassing')}
                          variant="outlined"
                          placeholder="2019"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subjects"
                          value={academicFormData.tenthSubjects}
                          onChange={handleAcademicFormChange('tenthSubjects')}
                          variant="outlined"
                          placeholder="English Comm., Hindi Course A, Mathematics, Science, Social Science"
                        />
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={updating}
                        sx={{ 
                          bgcolor: '#000',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          '&:hover': { bgcolor: '#333' }
                        }}
                      >
                        {updating ? <CircularProgress size={20} /> : 'UPDATE'}
                      </Button>
                    </Box>
                  </form>
                </StyledPaper>
              </TabPanel>

              {/* Skills Tab */}
              <TabPanel value={currentTab} index={2}>
                <StyledPaper elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    
                    {/* Technical Skills */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Technical Skills
                      </Typography>
                      {technicalSkills.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {technicalSkills.map((skill) => (
                            <Chip
                              key={skill.id}
                              label={skill.skill}
                              onDelete={() => handleDeleteTechnicalSkill(skill.skill)}
                              sx={{ bgcolor: '#f5f5f5', '& .MuiChip-deleteIcon': { fontSize: 18 } }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          No Technical Skills provided currently
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          placeholder="Add into Technical Skills"
                          value={newTechnicalSkill}
                          onChange={(e) => setNewTechnicalSkill(e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTechnicalSkill()}
                        />
                        <Button
                          onClick={handleAddTechnicalSkill}
                          variant="contained"
                          sx={{ 
                            bgcolor: '#000', 
                            color: 'white', 
                            minWidth: 'auto',
                            px: 3,
                            '&:hover': { bgcolor: '#333' }
                          }}
                        >
                          ADD
                        </Button>
                      </Box>
                    </Box>

                    {/* Other Skills */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Other Skills
                      </Typography>
                      {otherSkills.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {otherSkills.map((skill) => (
                            <Chip
                              key={skill.id}
                              label={skill.skill}
                              onDelete={() => handleDeleteOtherSkill(skill.skill)}
                              sx={{ bgcolor: '#f5f5f5', '& .MuiChip-deleteIcon': { fontSize: 18 } }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          No Other Skills provided currently
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          placeholder="Add into Other Skills"
                          value={newOtherSkill}
                          onChange={(e) => setNewOtherSkill(e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddOtherSkill()}
                        />
                        <Button
                          onClick={handleAddOtherSkill}
                          variant="contained"
                          sx={{ 
                            bgcolor: '#000', 
                            color: 'white', 
                            minWidth: 'auto',
                            px: 3,
                            '&:hover': { bgcolor: '#333' }
                          }}
                        >
                          ADD
                        </Button>
                      </Box>
                    </Box>

                    {/* Position of Responsibilities */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Position of Responsibilities
                      </Typography>
                      {responsibilities.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {responsibilities.map((resp) => (
                            <Chip
                              key={resp.id}
                              label={resp.responsibility}
                              onDelete={() => handleDeleteResponsibility(resp.responsibility)}
                              sx={{ bgcolor: '#f5f5f5', '& .MuiChip-deleteIcon': { fontSize: 18 } }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          No Position of Responsibilities provided currently
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          placeholder="Add into Position of Responsibilities"
                          value={newResponsibility}
                          onChange={(e) => setNewResponsibility(e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddResponsibility()}
                        />
                        <Button
                          onClick={handleAddResponsibility}
                          variant="contained"
                          sx={{ 
                            bgcolor: '#000', 
                            color: 'white', 
                            minWidth: 'auto',
                            px: 3,
                            '&:hover': { bgcolor: '#333' }
                          }}
                        >
                          ADD
                        </Button>
                      </Box>
                    </Box>

                    {/* Project Links / Portfolio */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Project Links / Portfolio
                      </Typography>
                      {projectLinks.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {projectLinks.map((link) => (
                            <Chip
                              key={link.id}
                              label={link.projectLink}
                              onDelete={() => handleDeleteProjectLink(link.projectLink)}
                              sx={{ bgcolor: '#f5f5f5', '& .MuiChip-deleteIcon': { fontSize: 18 } }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          No Project Links provided currently
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          placeholder="Add into Project Links"
                          value={newProjectLink}
                          onChange={(e) => setNewProjectLink(e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddProjectLink()}
                        />
                        <Button
                          onClick={handleAddProjectLink}
                          variant="contained"
                          sx={{ 
                            bgcolor: '#000', 
                            color: 'white', 
                            minWidth: 'auto',
                            px: 3,
                            '&:hover': { bgcolor: '#333' }
                          }}
                        >
                          ADD
                        </Button>
                      </Box>
                    </Box>

                    {/* Certificates Link */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Certificates Link
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          placeholder="Certificates Link"
                          value={certificatesLink}
                          onChange={(e) => setCertificatesLink(e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                          multiline
                          rows={2}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddCertificatesLink()}
                        />
                        <Button
                          onClick={handleAddCertificatesLink}
                          variant="contained"
                          disabled={updating}
                          sx={{ 
                            bgcolor: '#000', 
                            color: 'white', 
                            minWidth: 'auto',
                            px: 3,
                            '&:hover': { bgcolor: '#333' }
                          }}
                        >
                          {updating ? <CircularProgress size={20} /> : 'ADD'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </StyledPaper>
              </TabPanel>
            </CardContent>
          </Card>
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
} 