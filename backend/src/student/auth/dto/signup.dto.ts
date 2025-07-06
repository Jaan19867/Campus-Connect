import { IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  rollNumber: string;

  @IsString()
  @MinLength(6)
  password: string;
} 