-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('COMPUTER_SCIENCE', 'ELECTRONICS', 'MECHANICAL', 'CIVIL', 'ELECTRICAL', 'CHEMICAL', 'AEROSPACE', 'BIOTECHNOLOGY', 'INDUSTRIAL', 'INFORMATION_TECHNOLOGY');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PRE_PLACEMENT_TALK', 'WORKSHOP', 'SEMINAR', 'CAREER_FAIR', 'COMPANY_VISIT', 'WEBINAR');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'SHORTLISTED', 'NOT_SHORTLISTED', 'SELECTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'CLOSED', 'DRAFT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GenderEligibility" AS ENUM ('MALE', 'FEMALE', 'BOTH');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('JOB_ELIGIBLE', 'APPLICATION_UPDATE', 'EVENT_REMINDER', 'DEADLINE_REMINDER', 'GENERAL');

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "personalEmail" TEXT,
    "phoneNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "citizenship" TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "guardianName" TEXT,
    "category" TEXT,
    "debarred" BOOLEAN NOT NULL DEFAULT false,
    "currentAddressLine1" TEXT,
    "currentAddressLine2" TEXT,
    "currentAddressState" TEXT,
    "currentAddressPostalCode" TEXT,
    "permanentAddressLine1" TEXT,
    "permanentAddressLine2" TEXT,
    "permanentAddressState" TEXT,
    "permanentAddressPostalCode" TEXT,
    "branch" "Branch" NOT NULL,
    "currentYear" INTEGER NOT NULL,
    "gpa" DOUBLE PRECISION NOT NULL,
    "cgpa" DOUBLE PRECISION,
    "tenthMarks" DOUBLE PRECISION,
    "twelfthMarks" DOUBLE PRECISION,
    "profilePicture" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobDescription" TEXT,
    "formLink" TEXT,
    "location" TEXT,
    "companyName" TEXT NOT NULL,
    "companyId" TEXT,
    "jobType" TEXT NOT NULL,
    "ctc" INTEGER,
    "gradYear" TEXT NOT NULL,
    "drive" TEXT,
    "postData" TEXT,
    "applicationOpen" TIMESTAMP(3) NOT NULL,
    "applicationClosed" TIMESTAMP(3) NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
    "genderOpen" "GenderEligibility" NOT NULL DEFAULT 'BOTH',
    "pwdOnly" BOOLEAN NOT NULL DEFAULT false,
    "psu" BOOLEAN NOT NULL DEFAULT false,
    "backlogsAllowed" INTEGER NOT NULL DEFAULT 0,
    "openForPlaced" BOOLEAN NOT NULL DEFAULT false,
    "ctcCutoff" INTEGER NOT NULL DEFAULT 0,
    "tenthPercentageCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "twelfthPercentageCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "undergraduatePercentageCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "btech" BOOLEAN NOT NULL DEFAULT false,
    "btechCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "btechBranches" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "mtech" BOOLEAN NOT NULL DEFAULT false,
    "mtechCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mtechBranches" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "mba" BOOLEAN NOT NULL DEFAULT false,
    "mbaCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mbaBranches" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "bdes" BOOLEAN NOT NULL DEFAULT false,
    "bdesCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mdes" BOOLEAN NOT NULL DEFAULT false,
    "mdesCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ba" BOOLEAN NOT NULL DEFAULT false,
    "baCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ma" BOOLEAN NOT NULL DEFAULT false,
    "maCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bba" BOOLEAN NOT NULL DEFAULT false,
    "bbaCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "msc" BOOLEAN NOT NULL DEFAULT false,
    "mscCutoff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mscBranches" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "handledBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_cell" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "placement_cell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "duration" TEXT,
    "eventType" "EventType" NOT NULL DEFAULT 'PRE_PLACEMENT_TALK',
    "companyName" TEXT,
    "companyContact" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxAttendees" INTEGER,
    "addedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverLetter" TEXT,
    "selectedResumeId" TEXT,
    "adminFeedback" TEXT,
    "adminNotes" TEXT,
    "studentId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_skills" (
    "id" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "proficiency" "SkillLevel" NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "student_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_languages" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "student_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "studentId" TEXT NOT NULL,
    "jobId" TEXT,
    "eventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_rollNumber_key" ON "students"("rollNumber");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "placement_cell_email_key" ON "placement_cell"("email");

-- CreateIndex
CREATE UNIQUE INDEX "applications_studentId_jobId_key" ON "applications"("studentId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "student_skills_studentId_skillName_key" ON "student_skills"("studentId", "skillName");

-- CreateIndex
CREATE UNIQUE INDEX "student_languages_studentId_language_key" ON "student_languages"("studentId", "language");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_selectedResumeId_fkey" FOREIGN KEY ("selectedResumeId") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_skills" ADD CONSTRAINT "student_skills_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_languages" ADD CONSTRAINT "student_languages_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
