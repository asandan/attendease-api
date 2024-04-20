/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AttendanceSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `ScheduleSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ScheduleToSubject` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[groupId]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `day` to the `AttendanceSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `AttendanceSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekId` to the `AttendanceSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- DropForeignKey
ALTER TABLE "ScheduleSubject" DROP CONSTRAINT "ScheduleSubject_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSubject" DROP CONSTRAINT "ScheduleSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "_ScheduleToSubject" DROP CONSTRAINT "_ScheduleToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_ScheduleToSubject" DROP CONSTRAINT "_ScheduleToSubject_B_fkey";

-- DropIndex
DROP INDEX "AttendanceSnapshot_subjectId_key";

-- DropIndex
DROP INDEX "Subject_name_key";

-- AlterTable
ALTER TABLE "AttendanceSnapshot" DROP COLUMN "createdAt",
ADD COLUMN     "day" "WeekDays" NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "weekId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "day",
DROP COLUMN "time";

-- DropTable
DROP TABLE "ScheduleSubject";

-- DropTable
DROP TABLE "_ScheduleToSubject";

-- CreateTable
CREATE TABLE "Week" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Day" (
    "id" SERIAL NOT NULL,
    "name" "WeekDays" NOT NULL,
    "weekId" INTEGER NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaySubject" (
    "id" SERIAL NOT NULL,
    "dayId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,

    CONSTRAINT "DaySubject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_groupId_key" ON "Schedule"("groupId");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaySubject" ADD CONSTRAINT "DaySubject_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaySubject" ADD CONSTRAINT "DaySubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSnapshot" ADD CONSTRAINT "AttendanceSnapshot_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
