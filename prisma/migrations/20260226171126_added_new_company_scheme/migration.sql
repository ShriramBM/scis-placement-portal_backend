-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "address" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "jobLocation" TEXT,
ADD COLUMN     "jobTitle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "nature_of_business" TEXT,
ADD COLUMN     "no_vacancies" INTEGER,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "skillsRequired" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "state" TEXT,
ADD COLUMN     "type_of_organization" TEXT,
ADD COLUMN     "website" TEXT;
