// Enums
export enum Branch {
  CSE = 'CSE',
  ECE = 'ECE',
  EEE = 'EEE',
  MECH = 'MECH',
  CIVIL = 'CIVIL',
  CHEM = 'CHEM',
  IT = 'IT',
  AI_ML = 'AI_ML',
  DS = 'DS',
  CYBER = 'CYBER',
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
  name?: string;
  email?: string;
  phoneNumber?: string;
  branch?: Branch;
  year?: number;
  gpa?: number;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  graduationPercentage?: number;
  postGraduationPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentSkill {
  id: string;
  skillName: string;
  level: SkillLevel;
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Job related types
export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  salary?: string;
  applyBy: Date;
  status: JobStatus;
  
  // Eligibility criteria
  minGpa?: number;
  branches?: Branch[];
  minTenthPercentage?: number;
  minTwelfthPercentage?: number;
  minGraduationPercentage?: number;
  minPostGraduationPercentage?: number;
  genderEligibility?: GenderEligibility;
  pwdEligible?: boolean;
  maxBacklogs?: number;
  
  // Multi-degree eligibility
  bTechEligible?: boolean;
  mTechEligible?: boolean;
  mbaEligible?: boolean;
  bDesEligible?: boolean;
  mDesEligible?: boolean;
  baEligible?: boolean;
  maEligible?: boolean;
  bbaEligible?: boolean;
  mScEligible?: boolean;
  
  // Degree-specific cutoffs
  bTechCutoff?: number;
  mTechCutoff?: number;
  mbaCutoff?: number;
  bDesCutoff?: number;
  mDesCutoff?: number;
  baCutoff?: number;
  maCutoff?: number;
  bbaCutoff?: number;
  mScCutoff?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface JobWithEligibility extends Job {
  isEligible: boolean;
  eligibilityReasons: string[];
}

// Application related types
export interface Application {
  id: string;
  studentId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
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
  uploadedAt: Date;
}

// Event related types
export interface Event {
  id: string;
  title: string;
  description: string;
  company: string;
  eventType: EventType;
  eventDate: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
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