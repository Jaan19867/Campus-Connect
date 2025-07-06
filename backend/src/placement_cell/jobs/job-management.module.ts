import { Module } from '@nestjs/common';
import { JobManagementService } from './job-management.service';
import { JobManagementController } from './job-management.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [JobManagementController],
  providers: [JobManagementService, PrismaService, JwtStrategy],
  exports: [JobManagementService],
})
export class JobManagementModule {}
