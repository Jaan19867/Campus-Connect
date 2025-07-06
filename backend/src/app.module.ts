import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PcAuthModule } from './placement_cell/auth/pc-auth.module';
import { JobManagementModule } from './placement_cell/jobs/job-management.module';

@Module({
  imports: [PcAuthModule, JobManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
