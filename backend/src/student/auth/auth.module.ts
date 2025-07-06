import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StudentAuthService } from './auth.service';
import { StudentAuthController } from './auth.controller';
import { StudentJwtStrategy } from './student-jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [StudentAuthController],
  providers: [StudentAuthService, StudentJwtStrategy, PrismaService],
  exports: [StudentAuthService],
})
export class StudentAuthModule {}
