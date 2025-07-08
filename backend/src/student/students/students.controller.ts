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

  // Languages Management
  @Get('languages')
  async getLanguages(@Request() req) {
    const studentId = req.user.id;
    return this.studentsService.getLanguages(studentId);
  }

  @Post('languages')
  async addLanguage(
    @Body() addLanguageDto: { language: string },
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.addLanguage(studentId, addLanguageDto.language);
  }

  @Delete('languages/:language')
  async deleteLanguage(
    @Param('language') language: string,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.deleteLanguage(studentId, language);
  }

  // Technical Skills Management
  @Get('technical-skills')
  async getTechnicalSkills(@Request() req) {
    const studentId = req.user.id;
    return this.studentsService.getTechnicalSkills(studentId);
  }

  @Post('technical-skills')
  async addTechnicalSkill(
    @Body() addSkillDto: { skill: string },
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.addTechnicalSkill(studentId, addSkillDto.skill);
  }

  @Delete('technical-skills/:skill')
  async deleteTechnicalSkill(
    @Param('skill') skill: string,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.deleteTechnicalSkill(studentId, skill);
  }

  // Other Skills Management
  @Get('other-skills')
  async getOtherSkills(@Request() req) {
    const studentId = req.user.id;
    return this.studentsService.getOtherSkills(studentId);
  }

  @Post('other-skills')
  async addOtherSkill(
    @Body() addSkillDto: { skill: string },
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.addOtherSkill(studentId, addSkillDto.skill);
  }

  @Delete('other-skills/:skill')
  async deleteOtherSkill(
    @Param('skill') skill: string,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.deleteOtherSkill(studentId, skill);
  }

  // Responsibilities Management
  @Get('responsibilities')
  async getResponsibilities(@Request() req) {
    const studentId = req.user.id;
    return this.studentsService.getResponsibilities(studentId);
  }

  @Post('responsibilities')
  async addResponsibility(
    @Body() addResponsibilityDto: { responsibility: string },
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.addResponsibility(studentId, addResponsibilityDto.responsibility);
  }

  @Delete('responsibilities/:responsibility')
  async deleteResponsibility(
    @Param('responsibility') responsibility: string,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.deleteResponsibility(studentId, responsibility);
  }

  // Project Links Management
  @Get('project-links')
  async getProjectLinks(@Request() req) {
    const studentId = req.user.id;
    return this.studentsService.getProjectLinks(studentId);
  }

  @Post('project-links')
  async addProjectLink(
    @Body() addProjectLinkDto: { projectLink: string },
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.addProjectLink(studentId, addProjectLinkDto.projectLink);
  }

  @Delete('project-links/:projectLink')
  async deleteProjectLink(
    @Param('projectLink') projectLink: string,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.deleteProjectLink(studentId, decodeURIComponent(projectLink));
  }

  // Certificates Link Management
  @Put('certificates-link')
  async updateCertificatesLink(
    @Body() updateCertificatesLinkDto: { certificatesLink: string },
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.studentsService.updateCertificatesLink(studentId, updateCertificatesLinkDto.certificatesLink);
  }
}
