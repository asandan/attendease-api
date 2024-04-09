/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectsOnEP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubjectsOnEP" DROP CONSTRAINT "SubjectsOnEP_EPId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectsOnEP" DROP CONSTRAINT "SubjectsOnEP_subjectId_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "surname" DROP NOT NULL;

-- DropTable
DROP TABLE "Room";

-- DropTable
DROP TABLE "SubjectsOnEP";

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleSubject" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "ScheduleSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ScheduleToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ScheduleToSubject_AB_unique" ON "_ScheduleToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_ScheduleToSubject_B_index" ON "_ScheduleToSubject"("B");

-- AddForeignKey
ALTER TABLE "ScheduleSubject" ADD CONSTRAINT "ScheduleSubject_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubject" ADD CONSTRAINT "ScheduleSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToSubject" ADD CONSTRAINT "_ScheduleToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToSubject" ADD CONSTRAINT "_ScheduleToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
