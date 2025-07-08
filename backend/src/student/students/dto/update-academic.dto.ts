import { IsOptional, IsEnum, IsInt, IsNumber, IsString, Min, Max } from 'class-validator';
import { Branch } from '@prisma/client';

export class UpdateAcademicDto {
  // College Transcript
  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsEnum(Branch)
  branch?: Branch;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  currentYear?: number;

  @IsOptional()
  @IsString()
  yearOfGraduation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  gpa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  cgpa?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  backlogSubjects?: number;

  // Semester-wise CGPA
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  semester1Cgpa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  semester2Cgpa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  semester3Cgpa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  semester4Cgpa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  semester5Cgpa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  semester6Cgpa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  semester7Cgpa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  semester8Cgpa?: number;

  // Entrance Exam
  @IsOptional()
  @IsString()
  entranceExam?: string;

  @IsOptional()
  @IsString()
  entranceRank?: string;

  @IsOptional()
  @IsString()
  entranceCategory?: string;

  // XIIth Standard
  @IsOptional()
  @IsString()
  twelfthSchoolName?: string;

  @IsOptional()
  @IsString()
  twelfthBoard?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  twelfthMarks?: number;

  @IsOptional()
  @IsString()
  twelfthYearOfPassing?: string;

  @IsOptional()
  @IsString()
  twelfthSubjects?: string;

  // Xth Standard
  @IsOptional()
  @IsString()
  tenthSchoolName?: string;

  @IsOptional()
  @IsString()
  tenthBoard?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  tenthMarks?: number;

  @IsOptional()
  @IsString()
  tenthYearOfPassing?: string;

  @IsOptional()
  @IsString()
  tenthSubjects?: string;
} 