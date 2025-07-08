import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PcAuthModule } from './placement_cell/auth/pc-auth.module';
import { JobManagementModule } from './placement_cell/jobs/job-management.module';
import { StudentAuthModule } from './student/auth/auth.module';
import { StudentDashboardModule } from './student/dashboard/student-dashboard.module';
import { StudentJobsModule } from './student/jobs/jobs.module';
import { ApplicationsModule } from './student/applications/applications.module';
import { StudentsModule } from './student/students/students.module';
import { ResumesModule } from './student/resumes/resumes.module';

@Module({
  imports: [
    PcAuthModule, 
    JobManagementModule, 
    StudentAuthModule,
    StudentDashboardModule,
    StudentJobsModule,
    ApplicationsModule,
    StudentsModule,
    ResumesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
