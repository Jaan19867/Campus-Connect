import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async getMyApplications(studentId: string) {
    const applications = await this.prisma.application.findMany({
      where: {
        studentId,
      },
      include: {
        job: {
          select: {
            id: true,
            name: true,
            companyName: true,
            jobType: true,
            location: true,
            ctc: true,
            gradYear: true,
            applicationClosed: true,
            status: true,
          },
        },
        selectedResume: {
          select: {
            id: true,
            fileName: true,
            originalName: true,
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    return applications;
  }

  async getApplicationDetails(applicationId: string, studentId: string) {
    const application = await this.prisma.application.findFirst({
      where: {
        id: applicationId,
        studentId,
      },
      include: {
        job: {
          select: {
            id: true,
            name: true,
            companyName: true,
            jobType: true,
            location: true,
            ctc: true,
            gradYear: true,
            applicationOpen: true,
            applicationClosed: true,
            jobDescription: true,
            formLink: true,
            status: true,
          },
        },
        selectedResume: {
          select: {
            id: true,
            fileName: true,
            originalName: true,
            filePath: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async getApplicationsByStatus(studentId: string, status: string) {
    const applications = await this.prisma.application.findMany({
      where: {
        studentId,
        status: status as any,
      },
      include: {
        job: {
          select: {
            id: true,
            name: true,
            companyName: true,
            jobType: true,
            location: true,
            ctc: true,
            applicationClosed: true,
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    return applications;
  }

  async getApplicationStats(studentId: string) {
    const stats = await this.prisma.application.groupBy({
      by: ['status'],
      where: {
        studentId,
      },
      _count: {
        status: true,
      },
    });

    const totalApplications = await this.prisma.application.count({
      where: { studentId },
    });

    // Get recent applications
    const recentApplications = await this.prisma.application.findMany({
      where: { studentId },
      include: {
        job: {
          select: {
            name: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
      take: 5,
    });

    return {
      total: totalApplications,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {}),
      recent: recentApplications,
    };
  }

  async updateApplicationResume(applicationId: string, studentId: string, selectedResumeId: string) {
    // First, verify the application belongs to the student
    const application = await this.prisma.application.findFirst({
      where: {
        id: applicationId,
        studentId,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Verify the resume belongs to the student
    const resume = await this.prisma.resume.findFirst({
      where: {
        id: selectedResumeId,
        studentId,
      },
    });

    if (!resume) {
      throw new BadRequestException('Resume not found or does not belong to you');
    }

    // Update the application with the new resume
    const updatedApplication = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        selectedResumeId: selectedResumeId,
      },
      include: {
        job: {
          select: {
            id: true,
            name: true,
            companyName: true,
            jobType: true,
            location: true,
            ctc: true,
            gradYear: true,
            applicationOpen: true,
            applicationClosed: true,
            jobDescription: true,
            formLink: true,
            status: true,
          },
        },
        selectedResume: {
          select: {
            id: true,
            fileName: true,
            originalName: true,
            filePath: true,
          },
        },
      },
    });

    return {
      message: 'Resume updated successfully',
      application: updatedApplication,
    };
  }
}
