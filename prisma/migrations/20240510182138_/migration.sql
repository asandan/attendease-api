/*
  Warnings:

  - You are about to drop the column `role` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `role` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "role" "ROLE" NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "surname" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "role";
