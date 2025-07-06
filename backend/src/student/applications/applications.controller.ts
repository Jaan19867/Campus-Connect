import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { StudentJwtAuthGuard } from '../auth/student-jwt-auth.guard';

@Controller('student/applications')
@UseGuards(StudentJwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  async getMyApplications(@Request() req, @Query('status') status?: string) {
    const studentId = req.user.id;
    
    if (status) {
      return this.applicationsService.getApplicationsByStatus(studentId, status);
    }
    
    return this.applicationsService.getMyApplications(studentId);
  }

  @Get('stats')
  async getApplicationStats(@Request() req) {
    const studentId = req.user.id;
    return this.applicationsService.getApplicationStats(studentId);
  }

  @Get(':id')
  async getApplicationDetails(@Param('id') applicationId: string, @Request() req) {
    const studentId = req.user.id;
    return this.applicationsService.getApplicationDetails(applicationId, studentId);
  }
}
