import { IsOptional, IsEnum, IsInt, IsNumber, Min, Max } from 'class-validator';
import { Branch } from '@prisma/client';

export class UpdateAcademicDto {
  @IsOptional()
  @IsEnum(Branch)
  branch?: Branch;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  currentYear?: number; // 1, 2, 3, 4, 5

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
  @IsNumber()
  @Min(0)
  @Max(100)
  tenthMarks?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  twelfthMarks?: number;
} 