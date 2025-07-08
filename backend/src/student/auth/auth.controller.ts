import { 
  Controller, 
  Post, 
  Put,
  Get,
  Body, 
  HttpCode, 
  HttpStatus, 
  ValidationPipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Response,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response as ExpressResponse } from 'express';
import { createReadStream, existsSync } from 'fs';
import { StudentAuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { StudentJwtAuthGuard } from './student-jwt-auth.guard';

@Controller('student/auth')
export class AuthController {
  constructor(private readonly authService: StudentAuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body(ValidationPipe) signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body(ValidationPipe) signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Put('change-password')
  @UseGuards(StudentJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    const studentId = req.user.id;
    return this.authService.changePassword(studentId, changePasswordDto);
  }

  @Post('profile-picture')
  @UseGuards(StudentJwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
      },
      fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Only image files are allowed'), false);
        }
      },
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: any,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const studentId = req.user.id;
    return this.authService.updateProfilePicture(studentId, file);
  }

  @Get('profile-picture')
  @UseGuards(StudentJwtAuthGuard)
  async getProfilePicture(@Request() req, @Response() res: ExpressResponse) {
    const studentId = req.user.id;
    const profilePicturePath = await this.authService.getProfilePicture(studentId);
    
    if (!profilePicturePath) {
      throw new NotFoundException('Profile picture not found');
    }

    const filePath = join(process.cwd(), profilePicturePath);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('Profile picture file not found');
    }

    // Set headers for image display
    res.set({
      'Content-Type': 'image/jpeg', // Default to jpeg, could be improved to detect actual type
      'Content-Disposition': 'inline',
    });

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}
