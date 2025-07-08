import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { StudentAuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StudentJwtStrategy } from './student-jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    MulterModule.register({
      dest: './uploads/profile-pictures',
    }),
  ],
  controllers: [AuthController],
  providers: [StudentAuthService, StudentJwtStrategy, PrismaService],
  exports: [StudentAuthService],
})
export class StudentAuthModule {}
