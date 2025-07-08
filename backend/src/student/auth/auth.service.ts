import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class StudentAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    // Check if student already exists
    const existingStudent = await this.prisma.student.findUnique({
      where: { rollNumber: signupDto.rollNumber }
    });

    if (existingStudent) {
      throw new BadRequestException('Student with this roll number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    // Create student with minimal info
    const student = await this.prisma.student.create({
      data: {
        rollNumber: signupDto.rollNumber,
        email: `${signupDto.rollNumber}@temp.edu`, // Temporary email, can be updated later
        password: hashedPassword,
        firstName: 'Student', // Default value, can be updated later
        lastName: 'User', // Default value, can be updated later
        branch: 'COMPUTER_SCIENCE', // Default value, can be updated later
        currentYear: 1, // Default value, can be updated later
        gpa: 0, // Default value, can be updated later
      },
    });

    // Generate JWT token
    const payload = {
      sub: student.id,
      rollNumber: student.rollNumber,
      email: student.email,
      role: 'student'
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      student: {
        id: student.id,
        rollNumber: student.rollNumber,
        message: 'Account created successfully. Please update your profile information.',
      },
    };
  }

  async signin(signinDto: SigninDto) {
    const { rollNumber, password } = signinDto;

    // Find student by roll number
    const student = await this.prisma.student.findUnique({
      where: { rollNumber },
    });

    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if student is active
    if (!student.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: student.id,
      rollNumber: student.rollNumber,
      email: student.email,
      role: 'student'
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      student: {
        id: student.id,
        rollNumber: student.rollNumber,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        branch: student.branch,
        currentYear: student.currentYear,
        gpa: student.gpa,
      },
    };
  }

  async validateStudent(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
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
        tenthMarks: true,
        twelfthMarks: true,
        isActive: true,
      },
    });

    if (!student || !student.isActive) {
      throw new UnauthorizedException('Student not found or inactive');
    }

    return student;
  }

  async changePassword(studentId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmNewPassword } = changePasswordDto;

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    // Find student
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new UnauthorizedException('Student not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, student.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.student.update({
      where: { id: studentId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async updateProfilePicture(studentId: string, file: any) {
    // Update student profile picture
    const updatedStudent = await this.prisma.student.update({
      where: { id: studentId },
      data: {
        profilePicture: file.path,
      },
      select: {
        id: true,
        rollNumber: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
      },
    });

    return {
      message: 'Profile picture updated successfully',
      student: updatedStudent,
    };
  }

  async getProfilePicture(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: {
        profilePicture: true,
      },
    });

    return student?.profilePicture;
  }
}
