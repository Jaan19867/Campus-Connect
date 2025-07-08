/*
  Warnings:

  - Added the required column `mimeType` to the `resumes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "mimeType" TEXT NOT NULL;
