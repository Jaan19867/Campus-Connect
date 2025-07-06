import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { StudentDashboardService } from './student-dashboard.service';
import { StudentJwtAuthGuard } from '../auth/student-jwt-auth.guard';

@Controller('student/dashboard')
@UseGuards(StudentJwtAuthGuard)
export class StudentDashboardController {
  constructor(private readonly dashboardService: StudentDashboardService) {}

  @Get()
  async getDashboard(@Request() req) {
    const studentId = req.user.id;
    return this.dashboardService.getDashboard(studentId);
  }

  @Get('notifications')
  async getNotifications(@Request() req) {
    const studentId = req.user.id;
    return this.dashboardService.getEligibleJobs(studentId);
  }

  @Get('events')
  async getEvents() {
    return this.dashboardService.getEvents();
  }
}
