import { Module } from '@nestjs/common';
import { StudentJobsService } from './jobs.service';
import { StudentJobsController } from './jobs.controller';
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
  controllers: [StudentJobsController],
  providers: [StudentJobsService, PrismaService, StudentJwtStrategy],
  exports: [StudentJobsService],
})
export class StudentJobsModule {}
