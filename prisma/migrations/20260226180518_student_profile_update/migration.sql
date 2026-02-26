/*
  Warnings:

  - You are about to drop the column `backlogs` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `batchYear` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `cgpa` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `tenthScore` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `twelfthScore` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "AcadLevel" AS ENUM ('TENTH', 'TWELFTH', 'DIPLOMA', 'GRADUATION', 'POSTGRADUATION');

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "backlogs",
DROP COLUMN "batchYear",
DROP COLUMN "cgpa",
DROP COLUMN "tenthScore",
DROP COLUMN "twelfthScore",
ADD COLUMN     "alternateEmail" TEXT,
ADD COLUMN     "carreerType" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "currentAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE',
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "linkedInUrl" TEXT,
ADD COLUMN     "permanentAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "preferredJobLocation" TEXT;

-- CreateTable
CREATE TABLE "AcademicRecord" (
    "id" SERIAL NOT NULL,
    "studentProfileId" INTEGER NOT NULL,
    "level" "AcadLevel" NOT NULL DEFAULT 'GRADUATION',
    "institution_school_name" TEXT NOT NULL DEFAULT '',
    "board" TEXT,
    "university" TEXT,
    "yearOfPassing" INTEGER NOT NULL DEFAULT 0,
    "percentage_cgpa" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "AcademicRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AcademicRecord" ADD CONSTRAINT "AcademicRecord_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
