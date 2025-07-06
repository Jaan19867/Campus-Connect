import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PcAuthService } from './pc-auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('placement-cell/auth')
export class PcAuthController {
  constructor(private readonly authService: PcAuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
