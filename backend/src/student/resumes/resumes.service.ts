import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class ResumesService {
  constructor(private prisma: PrismaService) {}

  async getStudentResumes(studentId: string) {
    const resumes = await this.prisma.resume.findMany({
      where: { studentId },
      orderBy: { uploadedAt: 'desc' },
    });

    return resumes;
  }

  async getResumeById(id: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
    });

    return resume;
  }

  async uploadResume(studentId: string, file: any) {
    // Check if student already has 3 resumes
    const existingResumes = await this.prisma.resume.count({
      where: { studentId },
    });

    if (existingResumes >= 3) {
      throw new BadRequestException('You can only upload a maximum of 3 resumes');
    }

    // Create resume record in database
    const resume = await this.prisma.resume.create({
      data: {
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        studentId,
      },
    });

    return resume;
  }

  async deleteResume(id: string, studentId: string) {
    // Check if resume exists and belongs to the student
    const resume = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    if (resume.studentId !== studentId) {
      throw new ForbiddenException('You can only delete your own resumes');
    }

    // Delete file from filesystem
    const filePath = join(process.cwd(), resume.filePath);
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
      } catch (error) {
        console.error('Failed to delete resume file:', error);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete record from database
    await this.prisma.resume.delete({
      where: { id },
    });

    return { message: 'Resume deleted successfully' };
  }

  async getResumesByStudentId(studentId: string) {
    return this.getStudentResumes(studentId);
  }
}
