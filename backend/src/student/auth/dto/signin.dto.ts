import { IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsString()
  rollNumber: string;

  @IsString()
  @MinLength(6)
  password: string;
} 