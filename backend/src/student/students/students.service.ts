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

    const updatedStudent = await this.prisma.student.update({
      where: { id: studentId },
      data: updatePersonalDto,
      select: {
        id: true,
        rollNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
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
        branch: true,
        currentYear: true,
        gpa: true,
        cgpa: true,
        tenthMarks: true,
        twelfthMarks: true,
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
}
