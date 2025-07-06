import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentJobsService {
  constructor(private prisma: PrismaService) {}

  async getAllJobs(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const jobs = await this.prisma.job.findMany({
      where: {
        status: 'OPEN',
      },
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
        // Eligibility criteria
        btech: true,
        btechCutoff: true,
        btechBranches: true,
        mtech: true,
        mtechCutoff: true,
        mtechBranches: true,
        mba: true,
        mbaCutoff: true,
        mbaBranches: true,
        bdes: true,
        bdesCutoff: true,
        mdes: true,
        mdesCutoff: true,
        ba: true,
        baCutoff: true,
        ma: true,
        maCutoff: true,
        bba: true,
        bbaCutoff: true,
        msc: true,
        mscCutoff: true,
        mscBranches: true,
        tenthPercentageCutoff: true,
        twelfthPercentageCutoff: true,
        undergraduatePercentageCutoff: true,
        genderOpen: true,
        pwdOnly: true,
        backlogsAllowed: true,
        applications: {
          where: {
            studentId: studentId,
          },
          select: {
            id: true,
            status: true,
            appliedAt: true,
          },
        },
      },
      orderBy: {
        applicationClosed: 'asc',
      },
    });

    // Add eligibility status for each job
    const jobsWithEligibility = jobs.map(job => ({
      ...job,
      isEligible: this.checkEligibility(job, student),
      hasApplied: job.applications.length > 0,
      applicationStatus: job.applications.length > 0 ? job.applications[0].status : null,
    }));

    return jobsWithEligibility;
  }

  async getJobDetails(jobId: string, studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: {
          where: {
            studentId: studentId,
          },
          select: {
            id: true,
            status: true,
            appliedAt: true,
            coverLetter: true,
            selectedResume: {
              select: {
                id: true,
                fileName: true,
                originalName: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      ...job,
      isEligible: this.checkEligibility(job, student),
      hasApplied: job.applications.length > 0,
      applicationDetails: job.applications.length > 0 ? job.applications[0] : null,
    };
  }

  async applyToJob(jobId: string, studentId: string, coverLetter?: string, resumeId?: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: {
          where: {
            studentId: studentId,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if already applied
    if (job.applications.length > 0) {
      throw new BadRequestException('You have already applied to this job');
    }

    // Check if job is still open
    if (job.status !== 'OPEN') {
      throw new BadRequestException('This job is no longer accepting applications');
    }

    // Check application deadlines
    const now = new Date();
    if (now < job.applicationOpen) {
      throw new BadRequestException('Application period has not started yet');
    }
    if (now > job.applicationClosed) {
      throw new BadRequestException('Application period has ended');
    }

    // Check eligibility
    if (!this.checkEligibility(job, student)) {
      throw new BadRequestException('You are not eligible for this job');
    }

    // Verify resume if provided
    if (resumeId) {
      const resume = await this.prisma.resume.findFirst({
        where: {
          id: resumeId,
          studentId: studentId,
        },
      });

      if (!resume) {
        throw new BadRequestException('Resume not found');
      }
    }

    // Create application
    const application = await this.prisma.application.create({
      data: {
        studentId,
        jobId,
        coverLetter,
        selectedResumeId: resumeId,
        status: 'APPLIED',
      },
      include: {
        job: {
          select: {
            name: true,
            companyName: true,
          },
        },
      },
    });

    return application;
  }

  private checkEligibility(job: any, student: any): boolean {
    // Check academic cutoffs
    if (job.tenthPercentageCutoff > (student.tenthMarks || 0)) {
      return false;
    }
    if (job.twelfthPercentageCutoff > (student.twelfthMarks || 0)) {
      return false;
    }

    // Check degree-specific eligibility
    let degreeEligible = false;

    // Check B.Tech eligibility
    if (job.btech && job.btechCutoff <= student.gpa) {
      degreeEligible = true;
    }

    // Check M.Tech eligibility
    if (job.mtech && job.mtechCutoff <= student.gpa) {
      degreeEligible = true;
    }

    // Check MBA eligibility
    if (job.mba && job.mbaCutoff <= student.gpa) {
      degreeEligible = true;
    }

    // Check B.Des eligibility
    if (job.bdes && job.bdesCutoff <= student.gpa) {
      degreeEligible = true;
    }

    // Check M.Des eligibility
    if (job.mdes && job.mdesCutoff <= student.gpa) {
      degreeEligible = true;
    }

    // Check BA eligibility
    if (job.ba && job.baCutoff <= student.gpa) {
      degreeEligible = true;
    }

    // Check MA eligibility
    if (job.ma && job.maCutoff <= student.gpa) {
      degreeEligible = true;
    }

    // Check BBA eligibility
    if (job.bba && job.bbaCutoff <= student.gpa) {
      degreeEligible = true;
    }

    // Check M.Sc eligibility
    if (job.msc && job.mscCutoff <= student.gpa) {
      degreeEligible = true;
    }

    return degreeEligible;
  }
}
