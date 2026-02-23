-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_companyId_fkey";

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
