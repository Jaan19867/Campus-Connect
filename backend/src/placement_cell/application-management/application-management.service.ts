import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApplicationManagementService {
  constructor(private prisma: PrismaService) {}

  async getAllStudents() {
    return this.prisma.student.findMany({
      select: {
        id: true,
        rollNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        branch: true,
        currentYear: true,
        gpa: true,
        cgpa: true,
        isActive: true,
        createdAt: true,
        applications: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getStudentById(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            job: {
              select: {
                id: true,
                name: true,
                companyName: true,
                status: true,
              },
            },
          },
        },
        skills: true,
        languages: true,
        resumes: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }
}
