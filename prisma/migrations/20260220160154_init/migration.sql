-- CreateEnum
CREATE TYPE "Department" AS ENUM ('MCA', 'MTECH');

-- CreateEnum
CREATE TYPE "Stream" AS ENUM ('CSE', 'AI', 'IT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLACEMENT_OFFICER', 'PLACEMENT_COORDINATOR', 'STREAM_COORDINATOR', 'STUDENT');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'REJECTED', 'IGNORED', 'SHORTLISTED', 'SELECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "stream" "Stream",
    "role" "Role" NOT NULL,
    "placed" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "package" DOUBLE PRECISION NOT NULL,
    "department" "Department" NOT NULL,
    "streamsAllowed" "Stream"[],
    "deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "studentId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementRecord" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "remarks" TEXT,
    "issues" TEXT,
    "joiningDate" TIMESTAMP(3),
    "packageFinal" DOUBLE PRECISION,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementRemark" (
    "id" SERIAL NOT NULL,
    "placementId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "addedById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementRemark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Application_studentId_companyId_key" ON "Application"("studentId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "PlacementRecord_studentId_companyId_key" ON "PlacementRecord"("studentId", "companyId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementRecord" ADD CONSTRAINT "PlacementRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementRecord" ADD CONSTRAINT "PlacementRecord_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementRecord" ADD CONSTRAINT "PlacementRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementRemark" ADD CONSTRAINT "PlacementRemark_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "PlacementRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementRemark" ADD CONSTRAINT "PlacementRemark_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
