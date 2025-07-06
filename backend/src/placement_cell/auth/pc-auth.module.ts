import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PcAuthService } from './pc-auth.service';
import { PcAuthController } from './pc-auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [PcAuthController],
  providers: [PcAuthService, JwtStrategy, PrismaService],
  exports: [PcAuthService],
})
export class PcAuthModule {}
