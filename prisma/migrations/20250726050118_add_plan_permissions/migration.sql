-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "permissions" JSONB NOT NULL DEFAULT '{}';
