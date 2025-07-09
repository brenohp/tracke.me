/*
  Warnings:

  - You are about to drop the column `duration` on the `Service` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[subdomain]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subdomain` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationInMinutes` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "subdomain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "duration",
ADD COLUMN     "durationInMinutes" INTEGER NOT NULL,
ADD COLUMN     "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "_ProfessionalsOnServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfessionalsOnServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProfessionalsOnServices_B_index" ON "_ProfessionalsOnServices"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Business_subdomain_key" ON "Business"("subdomain");

-- AddForeignKey
ALTER TABLE "_ProfessionalsOnServices" ADD CONSTRAINT "_ProfessionalsOnServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalsOnServices" ADD CONSTRAINT "_ProfessionalsOnServices_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
