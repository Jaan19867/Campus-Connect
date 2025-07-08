import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Response,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response as ExpressResponse } from 'express';
import { createReadStream, existsSync } from 'fs';
import { StudentJwtAuthGuard } from '../auth/student-jwt-auth.guard';
import { ResumesService } from './resumes.service';

@Controller('student/resumes')
@UseGuards(StudentJwtAuthGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  async getMyResumes(@Request() req) {
    const studentId = req.user.id;
    return this.resumesService.getStudentResumes(studentId);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
      },
      fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Only PDF, DOC, and DOCX files are allowed'), false);
        }
      },
    }),
  )
  async uploadResume(
    @UploadedFile() file: any,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const studentId = req.user.id;
    return this.resumesService.uploadResume(studentId, file);
  }

  @Get(':id')
  async getResumeFile(@Param('id') id: string, @Response() res: ExpressResponse, @Request() req) {
    const studentId = req.user.id;
    const resume = await this.resumesService.getResumeById(id);
    
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    // Ensure the resume belongs to the current user
    if (resume.studentId !== studentId) {
      throw new NotFoundException('Resume not found');
    }

    const filePath = join(process.cwd(), resume.filePath);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('Resume file not found');
    }

    // Set headers for file download/view
    res.set({
      'Content-Type': resume.mimeType,
      'Content-Disposition': `inline; filename="${resume.originalName}"`,
    });

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Delete(':id')
  async deleteResume(@Param('id') id: string, @Request() req) {
    const studentId = req.user.id;
    return this.resumesService.deleteResume(id, studentId);
  }
}
