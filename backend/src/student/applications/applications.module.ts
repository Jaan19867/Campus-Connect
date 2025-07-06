import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
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
  controllers: [ApplicationsController],
  providers: [ApplicationsService, PrismaService, StudentJwtStrategy],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
