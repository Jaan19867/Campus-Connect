import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus, GenderEligibility } from '@prisma/client';

@Injectable()
export class JobManagementService {
  constructor(private prisma: PrismaService) {}

  async createJob(createJobDto: CreateJobDto, adminId: string) {
    try {
      // Get admin details for handledBy field
      const admin = await this.prisma.placementCell.findUnique({
        where: { id: adminId },
        select: { id: true, email: true }
      });

      if (!admin) {
        throw new BadRequestException('Admin not found');
      }

      const job = await this.prisma.job.create({
        data: {
          name: createJobDto.name,
          jobDescription: createJobDto.jobDescription,
          formLink: createJobDto.formLink,
          location: createJobDto.location,
          companyName: createJobDto.company.name,
          companyId: createJobDto.company._id,
          jobType: createJobDto.jobType,
          ctc: createJobDto.ctc,
          gradYear: createJobDto.gradYear,
          drive: createJobDto.drive,
          postData: createJobDto.postData,
          applicationOpen: new Date(createJobDto.applicationOpen),
          applicationClosed: new Date(createJobDto.applicationClosed),
          status: this.mapStatus(createJobDto.status || 'open'),
          genderOpen: this.mapGenderEligibility(createJobDto.genderOpen || 'both'),
          pwdOnly: createJobDto.pwdOnly || false,
          psu: createJobDto.psu || false,
          backlogsAllowed: createJobDto.backlogsAllowed || 0,
          openForPlaced: createJobDto.openForPlaced || false,
          ctcCutoff: createJobDto.ctcCutoff || 0,
          
          // Academic Cutoffs
          tenthPercentageCutoff: createJobDto.tenthPercentageCutoff || 0,
          twelfthPercentageCutoff: createJobDto.twelfthPercentageCutoff || 0,
          undergraduatePercentageCutoff: createJobDto.undergraduatePercentageCutoff || 0,
          
          // Degree-Specific Eligibility
          btech: createJobDto.btech || false,
          btechCutoff: createJobDto.btechCutoff || 0,
          btechBranches: createJobDto.btechBranches || [],
          
          mtech: createJobDto.mtech || false,
          mtechCutoff: createJobDto.mtechCutoff || 0,
          mtechBranches: createJobDto.mtechBranches || [],
          
          mba: createJobDto.mba || false,
          mbaCutoff: createJobDto.mbaCutoff || 0,
          mbaBranches: createJobDto.mbaBranches || [],
          
          bdes: createJobDto.bdes || false,
          bdesCutoff: createJobDto.bdesCutoff || 0,
          
          mdes: createJobDto.mdes || false,
          mdesCutoff: createJobDto.mdesCutoff || 0,
          
          ba: createJobDto.ba || false,
          baCutoff: createJobDto.baCutoff || 0,
          
          ma: createJobDto.ma || false,
          maCutoff: createJobDto.maCutoff || 0,
          
          bba: createJobDto.bba || false,
          bbaCutoff: createJobDto.bbaCutoff || 0,
          
          msc: createJobDto.msc || false,
          mscCutoff: createJobDto.mscCutoff || 0,
          mscBranches: createJobDto.mscBranches || [],
          
          // Admin Information
          handledBy: adminId,
        },
      });

      return job;
    } catch (error) {
      throw new BadRequestException('Failed to create job: ' + error.message);
    }
  }

  async getAllJobs() {
    return this.prisma.job.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getJobById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            student: {
              select: {
                id: true,
                rollNumber: true,
                firstName: true,
                lastName: true,
                email: true,
                branch: true,
                currentYear: true,
                gpa: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async updateJobStatus(id: string, status: JobStatus) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return this.prisma.job.update({
      where: { id },
      data: { status },
    });
  }

  async deleteJob(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return this.prisma.job.delete({
      where: { id },
    });
  }

  // Helper methods to map string values to enum values
  private mapStatus(status: string): JobStatus {
    switch (status?.toLowerCase()) {
      case 'open':
        return JobStatus.OPEN;
      case 'closed':
        return JobStatus.CLOSED;
      case 'draft':
        return JobStatus.DRAFT;
      case 'cancelled':
        return JobStatus.CANCELLED;
      default:
        return JobStatus.OPEN;
    }
  }

  private mapGenderEligibility(gender: string): GenderEligibility {
    switch (gender?.toLowerCase()) {
      case 'male':
        return GenderEligibility.MALE;
      case 'female':
        return GenderEligibility.FEMALE;
      case 'both':
        return GenderEligibility.BOTH;
      default:
        return GenderEligibility.BOTH;
    }
  }
}
