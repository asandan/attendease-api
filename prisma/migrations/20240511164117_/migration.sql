/*
  Warnings:

  - Added the required column `originalName` to the `MedicalCertificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalCertificate" ADD COLUMN     "originalName" TEXT NOT NULL;
