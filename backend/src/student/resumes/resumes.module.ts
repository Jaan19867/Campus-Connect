import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/resumes',
    }),
  ],
  controllers: [ResumesController],
  providers: [ResumesService, PrismaService],
  exports: [ResumesService],
})
export class ResumesModule {}
