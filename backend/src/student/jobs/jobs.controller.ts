import { Controller, Get, Post, Param, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { StudentJobsService } from './jobs.service';
import { StudentJwtAuthGuard } from '../auth/student-jwt-auth.guard';

class ApplyJobDto {
  coverLetter?: string;
  resumeId?: string;
}

@Controller('student/jobs')
@UseGuards(StudentJwtAuthGuard)
export class StudentJobsController {
  constructor(private readonly jobsService: StudentJobsService) {}

  @Get()
  async getAllJobs(@Request() req) {
    const studentId = req.user.id;
    return this.jobsService.getAllJobs(studentId);
  }

  @Get(':id')
  async getJobDetails(@Param('id') jobId: string, @Request() req) {
    const studentId = req.user.id;
    return this.jobsService.getJobDetails(jobId, studentId);
  }

  @Post(':id/apply')
  async applyToJob(
    @Param('id') jobId: string,
    @Body(ValidationPipe) applyJobDto: ApplyJobDto,
    @Request() req
  ) {
    const studentId = req.user.id;
    return this.jobsService.applyToJob(
      jobId,
      studentId,
      applyJobDto.coverLetter,
      applyJobDto.resumeId
    );
  }
}
