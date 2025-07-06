import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobManagementService } from './job-management.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from '@prisma/client';

@Controller('placement-cell/jobs')
@UseGuards(JwtAuthGuard)
export class JobManagementController {
  constructor(private readonly jobService: JobManagementService) {}

  @Post()
  async createJob(
    @Body(ValidationPipe) createJobDto: CreateJobDto,
    @Request() req
  ) {
    const adminId = req.user.id;
    return this.jobService.createJob(createJobDto, adminId);
  }

  @Get()
  async getAllJobs() {
    return this.jobService.getAllJobs();
  }

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }

  @Patch(':id/status')
  async updateJobStatus(
    @Param('id') id: string,
    @Body() body: { status: JobStatus }
  ) {
    return this.jobService.updateJobStatus(id, body.status);
  }

  @Delete('delete/:id')
  async deleteJob(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }
}
