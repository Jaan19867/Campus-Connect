import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { UpdateAcademicDto } from './dto/update-academic.dto';
import { AddSkillDto, UpdateSkillDto } from './dto/skill.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async getStudentProfile(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        skills: {
          orderBy: {
            skillName: 'asc',
          },
        },
        languages: {
          orderBy: {
            language: 'asc',
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const { password, ...studentWithoutPassword } = student;
    return studentWithoutPassword;
  }

  async updatePersonalInfo(studentId: string, updatePersonalDto: UpdatePersonalDto) {
    // Check if email is already taken by another student
    if (updatePersonalDto.email) {
      const existingStudent = await this.prisma.student.findFirst({
        where: {
          email: updatePersonalDto.email,
          NOT: { id: studentId },
        },
      });

      if (existingStudent) {
        throw new BadRequestException('Email is already taken');
      }
    }

    // Check if personal email is already taken by another student
    if (updatePersonalDto.personalEmail) {
      const existingStudent = await this.prisma.student.findFirst({
        where: {
          personalEmail: updatePersonalDto.personalEmail,
          NOT: { id: studentId },
        },
      });

      if (existingStudent) {
        throw new BadRequestException('Personal email is already taken');
      }
    }

    // Convert dateOfBirth string to Date if provided
    const updateData = {
      ...updatePersonalDto,
      dateOfBirth: updatePersonalDto.dateOfBirth ? new Date(updatePersonalDto.dateOfBirth) : undefined,
    };

    const updatedStudent = await this.prisma.student.update({
      where: { id: studentId },
      data: updateData,
      select: {
        id: true,
        rollNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        personalEmail: true,
        phoneNumber: true,
        dateOfBirth: true,
        gender: true,
        citizenship: true,
        fatherName: true,
        motherName: true,
        guardianName: true,
        category: true,
        debarred: true,
        currentAddressLine1: true,
        currentAddressLine2: true,
        currentAddressState: true,
        currentAddressPostalCode: true,
        permanentAddressLine1: true,
        permanentAddressLine2: true,
        permanentAddressState: true,
        permanentAddressPostalCode: true,
        updatedAt: true,
      },
    });

    return updatedStudent;
  }

  async updateAcademicInfo(studentId: string, updateAcademicDto: UpdateAcademicDto) {
    const updatedStudent = await this.prisma.student.update({
      where: { id: studentId },
      data: updateAcademicDto,
      select: {
        id: true,
        rollNumber: true,
        // College Transcript
        course: true,
        branch: true,
        currentYear: true,
        yearOfGraduation: true,
        gpa: true,
        cgpa: true,
        backlogSubjects: true,
        // Semester-wise CGPA
        semester1Cgpa: true,
        semester2Cgpa: true,
        semester3Cgpa: true,
        semester4Cgpa: true,
        semester5Cgpa: true,
        semester6Cgpa: true,
        semester7Cgpa: true,
        semester8Cgpa: true,
        // Entrance Exam
        entranceExam: true,
        entranceRank: true,
        entranceCategory: true,
        // XIIth Standard
        twelfthSchoolName: true,
        twelfthBoard: true,
        twelfthMarks: true,
        twelfthYearOfPassing: true,
        twelfthSubjects: true,
        // Xth Standard
        tenthSchoolName: true,
        tenthBoard: true,
        tenthMarks: true,
        tenthYearOfPassing: true,
        tenthSubjects: true,
        updatedAt: true,
      },
    });

    return updatedStudent;
  }

  async addSkill(studentId: string, addSkillDto: AddSkillDto) {
    // Check if skill already exists for this student
    const existingSkill = await this.prisma.studentSkill.findUnique({
      where: {
        studentId_skillName: {
          studentId,
          skillName: addSkillDto.skillName,
        },
      },
    });

    if (existingSkill) {
      throw new BadRequestException('Skill already exists. Use update to modify proficiency.');
    }

    const skill = await this.prisma.studentSkill.create({
      data: {
        studentId,
        skillName: addSkillDto.skillName,
        proficiency: addSkillDto.proficiency,
      },
    });

    return skill;
  }

  async updateSkill(studentId: string, skillName: string, updateSkillDto: UpdateSkillDto) {
    const skill = await this.prisma.studentSkill.findUnique({
      where: {
        studentId_skillName: {
          studentId,
          skillName,
        },
      },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    const updatedSkill = await this.prisma.studentSkill.update({
      where: {
        studentId_skillName: {
          studentId,
          skillName,
        },
      },
      data: {
        proficiency: updateSkillDto.proficiency,
      },
    });

    return updatedSkill;
  }

  async deleteSkill(studentId: string, skillName: string) {
    const skill = await this.prisma.studentSkill.findUnique({
      where: {
        studentId_skillName: {
          studentId,
          skillName,
        },
      },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    await this.prisma.studentSkill.delete({
      where: {
        studentId_skillName: {
          studentId,
          skillName,
        },
      },
    });

    return { message: 'Skill deleted successfully' };
  }

  async getSkills(studentId: string) {
    const skills = await this.prisma.studentSkill.findMany({
      where: { studentId },
      orderBy: {
        skillName: 'asc',
      },
    });

    return skills;
  }

  // Languages Management
  async getLanguages(studentId: string) {
    const languages = await this.prisma.studentLanguage.findMany({
      where: { studentId },
      orderBy: {
        language: 'asc',
      },
    });

    return languages;
  }

  async addLanguage(studentId: string, language: string) {
    // Check if language already exists for this student
    const existingLanguage = await this.prisma.studentLanguage.findUnique({
      where: {
        studentId_language: {
          studentId,
          language,
        },
      },
    });

    if (existingLanguage) {
      throw new BadRequestException('Language already exists');
    }

    const newLanguage = await this.prisma.studentLanguage.create({
      data: {
        studentId,
        language,
      },
    });

    return newLanguage;
  }

  async deleteLanguage(studentId: string, language: string) {
    const existingLanguage = await this.prisma.studentLanguage.findUnique({
      where: {
        studentId_language: {
          studentId,
          language,
        },
      },
    });

    if (!existingLanguage) {
      throw new NotFoundException('Language not found');
    }

    await this.prisma.studentLanguage.delete({
      where: {
        studentId_language: {
          studentId,
          language,
        },
      },
    });

    return { message: 'Language deleted successfully' };
  }

  // Technical Skills Management
  async getTechnicalSkills(studentId: string) {
    const technicalSkills = await this.prisma.studentTechnicalSkill.findMany({
      where: { studentId },
      orderBy: { skill: 'asc' },
    });
    return technicalSkills;
  }

  async addTechnicalSkill(studentId: string, skill: string) {
    const existingSkill = await this.prisma.studentTechnicalSkill.findUnique({
      where: {
        studentId_skill: { studentId, skill },
      },
    });

    if (existingSkill) {
      throw new BadRequestException('Technical skill already exists');
    }

    const newSkill = await this.prisma.studentTechnicalSkill.create({
      data: { studentId, skill },
    });

    return newSkill;
  }

  async deleteTechnicalSkill(studentId: string, skill: string) {
    const existingSkill = await this.prisma.studentTechnicalSkill.findUnique({
      where: {
        studentId_skill: { studentId, skill },
      },
    });

    if (!existingSkill) {
      throw new NotFoundException('Technical skill not found');
    }

    await this.prisma.studentTechnicalSkill.delete({
      where: {
        studentId_skill: { studentId, skill },
      },
    });

    return { message: 'Technical skill deleted successfully' };
  }

  // Other Skills Management
  async getOtherSkills(studentId: string) {
    const otherSkills = await this.prisma.studentOtherSkill.findMany({
      where: { studentId },
      orderBy: { skill: 'asc' },
    });
    return otherSkills;
  }

  async addOtherSkill(studentId: string, skill: string) {
    const existingSkill = await this.prisma.studentOtherSkill.findUnique({
      where: {
        studentId_skill: { studentId, skill },
      },
    });

    if (existingSkill) {
      throw new BadRequestException('Other skill already exists');
    }

    const newSkill = await this.prisma.studentOtherSkill.create({
      data: { studentId, skill },
    });

    return newSkill;
  }

  async deleteOtherSkill(studentId: string, skill: string) {
    const existingSkill = await this.prisma.studentOtherSkill.findUnique({
      where: {
        studentId_skill: { studentId, skill },
      },
    });

    if (!existingSkill) {
      throw new NotFoundException('Other skill not found');
    }

    await this.prisma.studentOtherSkill.delete({
      where: {
        studentId_skill: { studentId, skill },
      },
    });

    return { message: 'Other skill deleted successfully' };
  }

  // Responsibilities Management
  async getResponsibilities(studentId: string) {
    const responsibilities = await this.prisma.studentResponsibility.findMany({
      where: { studentId },
      orderBy: { responsibility: 'asc' },
    });
    return responsibilities;
  }

  async addResponsibility(studentId: string, responsibility: string) {
    const existingResponsibility = await this.prisma.studentResponsibility.findUnique({
      where: {
        studentId_responsibility: { studentId, responsibility },
      },
    });

    if (existingResponsibility) {
      throw new BadRequestException('Responsibility already exists');
    }

    const newResponsibility = await this.prisma.studentResponsibility.create({
      data: { studentId, responsibility },
    });

    return newResponsibility;
  }

  async deleteResponsibility(studentId: string, responsibility: string) {
    const existingResponsibility = await this.prisma.studentResponsibility.findUnique({
      where: {
        studentId_responsibility: { studentId, responsibility },
      },
    });

    if (!existingResponsibility) {
      throw new NotFoundException('Responsibility not found');
    }

    await this.prisma.studentResponsibility.delete({
      where: {
        studentId_responsibility: { studentId, responsibility },
      },
    });

    return { message: 'Responsibility deleted successfully' };
  }

  // Project Links Management
  async getProjectLinks(studentId: string) {
    const projectLinks = await this.prisma.studentProjectLink.findMany({
      where: { studentId },
      orderBy: { projectLink: 'asc' },
    });
    return projectLinks;
  }

  async addProjectLink(studentId: string, projectLink: string) {
    const existingProjectLink = await this.prisma.studentProjectLink.findUnique({
      where: {
        studentId_projectLink: { studentId, projectLink },
      },
    });

    if (existingProjectLink) {
      throw new BadRequestException('Project link already exists');
    }

    const newProjectLink = await this.prisma.studentProjectLink.create({
      data: { studentId, projectLink },
    });

    return newProjectLink;
  }

  async deleteProjectLink(studentId: string, projectLink: string) {
    const existingProjectLink = await this.prisma.studentProjectLink.findUnique({
      where: {
        studentId_projectLink: { studentId, projectLink },
      },
    });

    if (!existingProjectLink) {
      throw new NotFoundException('Project link not found');
    }

    await this.prisma.studentProjectLink.delete({
      where: {
        studentId_projectLink: { studentId, projectLink },
      },
    });

    return { message: 'Project link deleted successfully' };
  }

  // Certificates Link Management
  async updateCertificatesLink(studentId: string, certificatesLink: string) {
    const updatedStudent = await this.prisma.student.update({
      where: { id: studentId },
      data: { certificatesLink },
      select: {
        id: true,
        certificatesLink: true,
        updatedAt: true,
      },
    });

    return updatedStudent;
  }
}
