/*
  Warnings:

  - A unique constraint covering the columns `[stripeCouponId]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Coupon" ADD COLUMN     "stripeCouponId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_stripeCouponId_key" ON "public"."Coupon"("stripeCouponId");
