import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(studentId: string) {
    // Get student details
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        rollNumber: true,
        firstName: true,
        lastName: true,
        branch: true,
        currentYear: true,
        gpa: true,
        cgpa: true,
        tenthMarks: true,
        twelfthMarks: true,
      },
    });

    // Get eligible jobs (notifications)
    const eligibleJobs = await this.getEligibleJobs(studentId);

    // Get events
    const events = await this.getEvents();

    // Get application stats
    const applicationStats = await this.getApplicationStats(studentId);

    return {
      student,
      notifications: {
        eligibleJobs,
        count: eligibleJobs.length,
      },
      events,
      applicationStats,
    };
  }

  async getEligibleJobs(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return [];
    }

    // Get jobs where student is eligible
    const eligibleJobs = await this.prisma.job.findMany({
      where: {
        status: 'OPEN',
        applicationOpen: { lte: new Date() },
        applicationClosed: { gte: new Date() },
        AND: [
          // Check if student already applied
          {
            NOT: {
              applications: {
                some: {
                  studentId: studentId,
                },
              },
            },
          },
          // Check eligibility based on student's branch and degree
          {
            OR: [
              // For B.Tech students
              {
                AND: [
                  { btech: true },
                  { btechCutoff: { lte: student.gpa } },
                  // Add branch checking logic here if needed
                ],
              },
              // For M.Tech students
              {
                AND: [
                  { mtech: true },
                  { mtechCutoff: { lte: student.gpa } },
                ],
              },
              // Add other degree checks as needed
            ],
          },
          // Check academic cutoffs
          {
            tenthPercentageCutoff: { lte: student.tenthMarks || 0 },
            twelfthPercentageCutoff: { lte: student.twelfthMarks || 0 },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        companyName: true,
        jobType: true,
        location: true,
        applicationClosed: true,
        ctc: true,
        status: true,
      },
      orderBy: {
        applicationClosed: 'asc',
      },
    });

    return eligibleJobs;
  }

  async getEvents() {
    return this.prisma.event.findMany({
      where: {
        isActive: true,
        eventDate: { gte: new Date() },
      },
      select: {
        id: true,
        title: true,
        description: true,
        eventDate: true,
        venue: true,
        eventType: true,
        companyName: true,
        duration: true,
      },
      orderBy: {
        eventDate: 'asc',
      },
    });
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

    return {
      total: totalApplications,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {}),
    };
  }
}
