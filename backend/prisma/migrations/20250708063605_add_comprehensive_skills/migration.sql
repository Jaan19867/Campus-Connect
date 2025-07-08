-- AlterTable
ALTER TABLE "students" ADD COLUMN     "certificatesLink" TEXT;

-- CreateTable
CREATE TABLE "student_technical_skills" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "student_technical_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_other_skills" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "student_other_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_responsibilities" (
    "id" TEXT NOT NULL,
    "responsibility" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "student_responsibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_project_links" (
    "id" TEXT NOT NULL,
    "projectLink" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "student_project_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_technical_skills_studentId_skill_key" ON "student_technical_skills"("studentId", "skill");

-- CreateIndex
CREATE UNIQUE INDEX "student_other_skills_studentId_skill_key" ON "student_other_skills"("studentId", "skill");

-- CreateIndex
CREATE UNIQUE INDEX "student_responsibilities_studentId_responsibility_key" ON "student_responsibilities"("studentId", "responsibility");

-- CreateIndex
CREATE UNIQUE INDEX "student_project_links_studentId_projectLink_key" ON "student_project_links"("studentId", "projectLink");

-- AddForeignKey
ALTER TABLE "student_technical_skills" ADD CONSTRAINT "student_technical_skills_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_other_skills" ADD CONSTRAINT "student_other_skills_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_responsibilities" ADD CONSTRAINT "student_responsibilities_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_project_links" ADD CONSTRAINT "student_project_links_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
