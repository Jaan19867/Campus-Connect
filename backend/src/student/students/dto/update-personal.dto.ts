import { IsString, IsEmail, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdatePersonalDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  citizenship?: string;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsOptional()
  @IsString()
  guardianName?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  debarred?: boolean;

  // Address Information
  @IsOptional()
  @IsString()
  currentAddressLine1?: string;

  @IsOptional()
  @IsString()
  currentAddressLine2?: string;

  @IsOptional()
  @IsString()
  currentAddressState?: string;

  @IsOptional()
  @IsString()
  currentAddressPostalCode?: string;

  @IsOptional()
  @IsString()
  permanentAddressLine1?: string;

  @IsOptional()
  @IsString()
  permanentAddressLine2?: string;

  @IsOptional()
  @IsString()
  permanentAddressState?: string;

  @IsOptional()
  @IsString()
  permanentAddressPostalCode?: string;
} 