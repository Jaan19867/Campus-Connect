import { Controller, Post, Body, Get, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { StudentAuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { StudentJwtAuthGuard } from './student-jwt-auth.guard';

@Controller('student/auth')
export class StudentAuthController {
  constructor(private readonly authService: StudentAuthService) {}

  @Post('signup')
  async signup(@Body(ValidationPipe) signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  async signin(@Body(ValidationPipe) signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @UseGuards(StudentJwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.validateStudent(req.user.id);
  }
}
