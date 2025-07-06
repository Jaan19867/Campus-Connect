import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
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
  controllers: [StudentsController],
  providers: [StudentsService, PrismaService, StudentJwtStrategy],
  exports: [StudentsService],
})
export class StudentsModule {}
