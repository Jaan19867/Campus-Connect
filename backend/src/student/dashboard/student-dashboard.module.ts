import { Module } from '@nestjs/common';
import { StudentDashboardService } from './student-dashboard.service';
import { StudentDashboardController } from './student-dashboard.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentJwtStrategy } from '../auth/student-jwt.strategy';
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
  controllers: [StudentDashboardController],
  providers: [StudentDashboardService, PrismaService, StudentJwtStrategy],
  exports: [StudentDashboardService],
})
export class StudentDashboardModule {}

