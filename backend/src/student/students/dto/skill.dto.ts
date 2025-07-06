import { IsString, IsEnum } from 'class-validator';
import { SkillLevel } from '@prisma/client';

export class AddSkillDto {
  @IsString()
  skillName: string;

  @IsEnum(SkillLevel)
  proficiency: SkillLevel;
}

export class UpdateSkillDto {
  @IsEnum(SkillLevel)
  proficiency: SkillLevel;
} 