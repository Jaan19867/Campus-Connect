import { Module } from '@nestjs/common';
import { ApplicationManagementService } from './application-management.service';
import { ApplicationManagementController } from './application-management.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ApplicationManagementController],
  providers: [ApplicationManagementService, PrismaService],
  exports: [ApplicationManagementService],
})
export class ApplicationManagementModule {}
