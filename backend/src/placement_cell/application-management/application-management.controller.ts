import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApplicationManagementService } from './application-management.service';

@Controller('placement-cell')
@UseGuards(JwtAuthGuard)
export class ApplicationManagementController {
  constructor(private readonly applicationService: ApplicationManagementService) {}

  @Get('students')
  async getAllStudents() {
    return this.applicationService.getAllStudents();
  }

  @Get('students/:id')
  async getStudentById(@Param('id') id: string) {
    return this.applicationService.getStudentById(id);
  }
}
