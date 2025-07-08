// Enums
export enum Branch {
  COMPUTER_SCIENCE = 'COMPUTER_SCIENCE',
  ELECTRONICS = 'ELECTRONICS',
  MECHANICAL = 'MECHANICAL',
  CIVIL = 'CIVIL',
  ELECTRICAL = 'ELECTRICAL',
  CHEMICAL = 'CHEMICAL',
  AEROSPACE = 'AEROSPACE',
  BIOTECHNOLOGY = 'BIOTECHNOLOGY',
  INDUSTRIAL = 'INDUSTRIAL',
  INFORMATION_TECHNOLOGY = 'INFORMATION_TECHNOLOGY',
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  SELECTED = 'SELECTED',
  REJECTED = 'REJECTED',
}

export enum GenderEligibility {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  ALL = 'ALL',
}

export enum EventType {
  PRE_PLACEMENT_TALK = 'PRE_PLACEMENT_TALK',
  SEMINAR = 'SEMINAR',
  WORKSHOP = 'WORKSHOP',
  CAREER_FAIR = 'CAREER_FAIR',
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum NotificationType {
  JOB_POSTED = 'JOB_POSTED',
  APPLICATION_UPDATE = 'APPLICATION_UPDATE',
  EVENT_REMINDER = 'EVENT_REMINDER',
  GENERAL = 'GENERAL',
}

// Student related types
export interface Student {
  id: string;
  rollNumber: string;
  email: string;
  // Personal Information
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  // Academic Information
  branch: Branch;
  currentYear: number;
  gpa: number;
  cgpa?: number;
  tenthMarks?: number;
  twelfthMarks?: number;
  // Account Settings
  profilePicture?: string;
  isActive: boolean;
  // Timestamps
  createdAt: string;
  updatedAt: string;
  // Relations (when included)
  skills?: StudentSkill[];
}

export interface StudentSkill {
  id: string;
  skillName: string;
  proficiency: SkillLevel;
  studentId: string;
}

// Job related types
export interface Job {
  id: string;
  name: string;
  companyName: string;
  jobType: string;
  location: string;
  ctc?: number;
  gradYear: string;
  applicationOpen: string;
  applicationClosed: string;
  jobDescription?: string;
  formLink?: string;
  
  // Eligibility criteria
  btech?: boolean;
  btechCutoff?: number;
  btechBranches?: number[];
  mtech?: boolean;
  mtechCutoff?: number;
  mtechBranches?: number[];
  mba?: boolean;
  mbaCutoff?: number;
  mbaBranches?: number[];
  bdes?: boolean;
  bdesCutoff?: number;
  mdes?: boolean;
  mdesCutoff?: number;
  ba?: boolean;
  baCutoff?: number;
  ma?: boolean;
  maCutoff?: number;
  bba?: boolean;
  bbaCutoff?: number;
  msc?: boolean;
  mscCutoff?: number;
  mscBranches?: number[];
  
  tenthPercentageCutoff?: number;
  twelfthPercentageCutoff?: number;
  undergraduatePercentageCutoff?: number;
  genderOpen?: string;
  pwdOnly?: boolean;
  backlogsAllowed?: number;
  
  // Application info
  applications?: Array<{
    id: string;
    status: string;
    appliedAt: string;
  }>;
  
  // Computed fields
  isEligible?: boolean;
  hasApplied?: boolean;
  applicationStatus?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface JobWithEligibility extends Job {
  isEligible: boolean;
  eligibilityReasons?: string[];
}

// Application related types
export interface Application {
  id: string;
  studentId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  job: Job;
}

export interface ApplicationStats {
  totalApplications: number;
  appliedCount: number;
  shortlistedCount: number;
  selectedCount: number;
  rejectedCount: number;
}

// Resume related types
export interface Resume {
  id: string;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  studentId: string;
  uploadedAt: string;
}

// Event related types
export interface Event {
  id: string;
  title: string;
  description: string;
  company: string;
  eventType: EventType;
  eventDate: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

// Notification related types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  studentId: string;
  jobId?: string;
  eventId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dashboard related types
export interface DashboardData {
  notifications: Notification[];
  events: Event[];
  stats: {
    totalApplications: number;
    activeJobs: number;
    upcomingEvents: number;
  };
}

// Auth related types
export interface AuthUser {
  id: string;
  rollNumber: string;
  name?: string;
  email?: string;
}

export interface LoginRequest {
  rollNumber: string;
  password: string;
}

export interface SignupRequest {
  rollNumber: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

// Form DTOs
export interface UpdatePersonalInfoDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UpdateAcademicInfoDto {
  branch?: Branch;
  year?: number;
  gpa?: number;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  graduationPercentage?: number;
  postGraduationPercentage?: number;
}

export interface CreateSkillDto {
  skillName: string;
  level: SkillLevel;
}

export interface UpdateSkillDto {
  skillName?: string;
  level?: SkillLevel;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// JWT Token
export interface DecodedToken {
  sub: string;
  rollNumber: string;
  exp: number;
  iat: number;
} 