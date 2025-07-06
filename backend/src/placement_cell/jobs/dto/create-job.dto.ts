import { IsString, IsBoolean, IsOptional, IsInt, IsNumber, IsArray, IsDateString, IsEnum } from 'class-validator';

export class CreateJobDto {
  // Basic Job Information
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsString()
  formLink?: string;

  @IsOptional()
  @IsString()
  location?: string;

  // Company Information
  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  // Job Details
  @IsString()
  jobType: string; // "intern", "fulltime", etc.

  @IsOptional()
  @IsInt()
  ctc?: number;

  @IsString()
  gradYear: string;

  @IsOptional()
  @IsString()
  drive?: string;

  @IsOptional()
  @IsString()
  postData?: string;

  // Application Timing
  @IsDateString()
  applicationOpen: string;

  @IsDateString()
  applicationClosed: string;

  // General Eligibility
  @IsOptional()
  @IsEnum(['OPEN', 'CLOSED', 'DRAFT', 'CANCELLED'])
  status?: string;

  @IsOptional()
  @IsEnum(['MALE', 'FEMALE', 'BOTH'])
  genderOpen?: string;

  @IsOptional()
  @IsBoolean()
  pwdOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  psu?: boolean;

  @IsOptional()
  @IsInt()
  backlogsAllowed?: number;

  @IsOptional()
  @IsBoolean()
  openForPlaced?: boolean;

  @IsOptional()
  @IsInt()
  ctcCutoff?: number;

  // Academic Cutoffs
  @IsOptional()
  @IsNumber()
  tenthPercentageCutoff?: number;

  @IsOptional()
  @IsNumber()
  twelfthPercentageCutoff?: number;

  @IsOptional()
  @IsNumber()
  undergraduatePercentageCutoff?: number;

  // Degree-Specific Eligibility
  // B.Tech
  @IsOptional()
  @IsBoolean()
  btech?: boolean;

  @IsOptional()
  @IsNumber()
  btechCutoff?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  btechBranches?: number[];

  // M.Tech
  @IsOptional()
  @IsBoolean()
  mtech?: boolean;

  @IsOptional()
  @IsNumber()
  mtechCutoff?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  mtechBranches?: number[];

  // MBA
  @IsOptional()
  @IsBoolean()
  mba?: boolean;

  @IsOptional()
  @IsNumber()
  mbaCutoff?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  mbaBranches?: number[];

  // B.Des
  @IsOptional()
  @IsBoolean()
  bdes?: boolean;

  @IsOptional()
  @IsNumber()
  bdesCutoff?: number;

  // M.Des
  @IsOptional()
  @IsBoolean()
  mdes?: boolean;

  @IsOptional()
  @IsNumber()
  mdesCutoff?: number;

  // BA
  @IsOptional()
  @IsBoolean()
  ba?: boolean;

  @IsOptional()
  @IsNumber()
  baCutoff?: number;

  // MA
  @IsOptional()
  @IsBoolean()
  ma?: boolean;

  @IsOptional()
  @IsNumber()
  maCutoff?: number;

  // BBA
  @IsOptional()
  @IsBoolean()
  bba?: boolean;

  @IsOptional()
  @IsNumber()
  bbaCutoff?: number;

  // M.Sc
  @IsOptional()
  @IsBoolean()
  msc?: boolean;

  @IsOptional()
  @IsNumber()
  mscCutoff?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  mscBranches?: number[];
} 