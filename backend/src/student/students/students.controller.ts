import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentJwtAuthGuard } from '../auth/student-jwt-auth.guard';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { UpdateAcademicDto } from './dto/update-academic.dto';
import { AddSkillDto, UpdateSkillDto } from './dto/skill.dto';

@Controller('student/my-information')
@UseGuards(StudentJwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const studentId = req.user.id;
    return this.studentsService.getStudentProfile(studentId);
  }

  // Personal Information
  @Put('personal')
  async updatePersonalInfo(
    @Body(ValidationPipe) updatePersonalDto: UpdatePersonalDto,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.updatePersonalInfo(studentId, updatePersonalDto);
  }

  // Academic Information
  @Put('academic')
  async updateAcademicInfo(
    @Body(ValidationPipe) updateAcademicDto: UpdateAcademicDto,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.updateAcademicInfo(studentId, updateAcademicDto);
  }

  // Skills Management
  @Get('skills')
  async getSkills(@Request() req) {
    const studentId = req.user.id;
    return this.studentsService.getSkills(studentId);
  }

  @Post('skills')
  async addSkill(
    @Body(ValidationPipe) addSkillDto: AddSkillDto,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.addSkill(studentId, addSkillDto);
  }

  @Put('skills/:skillName')
  async updateSkill(
    @Param('skillName') skillName: string,
    @Body(ValidationPipe) updateSkillDto: UpdateSkillDto,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.updateSkill(studentId, skillName, updateSkillDto);
  }

  @Delete('skills/:skillName')
  async deleteSkill(
    @Param('skillName') skillName: string,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.deleteSkill(studentId, skillName);
  }
}
