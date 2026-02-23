-- DropForeignKey
ALTER TABLE "PlacementRecord" DROP CONSTRAINT "PlacementRecord_companyId_fkey";

-- AddForeignKey
ALTER TABLE "PlacementRecord" ADD CONSTRAINT "PlacementRecord_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
