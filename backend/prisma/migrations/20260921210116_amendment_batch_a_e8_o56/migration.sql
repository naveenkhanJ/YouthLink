/*
  Warnings:

  - You are about to alter the column `resolutionNotes` on the `DisputeCase` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `question` on the `DisputeClarificationRequest` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `response` on the `DisputeClarificationRequest` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `publicResponse` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `removalReason` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `detail` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `reason` on the `Warning` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - Changed the type of `action` on the `AuditLogEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `targetType` on the `AuditLogEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AccountRecoveryStatus" AS ENUM ('AWAITING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CASE_REVIEW_OPENED', 'CLARIFICATION_REQUESTED', 'WARNING_RECORDED', 'CASE_CLOSED_NO_ACTION', 'CASE_ESCALATED', 'DISPUTE_RULED', 'CONTENT_RESTORED', 'CONTENT_ESCALATED', 'POSTING_REMOVED', 'RATING_REMOVED', 'ACCOUNT_SUSPENDED', 'USER_PROMOTED', 'STAFF_PASSWORD_RESET', 'STAFF_ACCESS_REMOVED', 'METRICS_EXPORTED', 'ACCOUNT_RECOVERY_APPROVED', 'ACCOUNT_RECOVERY_REJECTED');

-- CreateEnum
CREATE TYPE "AuditTargetType" AS ENUM ('USER', 'POSTING', 'RATING', 'DISPUTE_CASE', 'REPORT', 'ADMIN_ACCOUNT', 'PLATFORM_METRICS');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'CANCELLATION_RESOLVED';
ALTER TYPE "NotificationType" ADD VALUE 'RATING_WINDOW_OPEN';
ALTER TYPE "NotificationType" ADD VALUE 'RATING_REVEALED';
ALTER TYPE "NotificationType" ADD VALUE 'DISPUTE_OPENED';
ALTER TYPE "NotificationType" ADD VALUE 'DISPUTE_RESOLVED';
ALTER TYPE "NotificationType" ADD VALUE 'FLAGGED_CONTENT_OUTCOME';

-- AlterTable
ALTER TABLE "AdminAccount" ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "lastSignInAt" TIMESTAMP(3),
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3),
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AuditLogEntry" DROP COLUMN "action",
ADD COLUMN     "action" "AuditAction" NOT NULL,
DROP COLUMN "targetType",
ADD COLUMN     "targetType" "AuditTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "DisputeCase" ALTER COLUMN "resolutionNotes" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "DisputeClarificationRequest" ALTER COLUMN "question" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "response" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "Engagement" ADD COLUMN     "arrivalFailedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completionFailedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "paymentFailedAttempts" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Rating" ALTER COLUMN "publicResponse" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "removalReason" SET DATA TYPE VARCHAR(300);

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "detail" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordChangedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Warning" ALTER COLUMN "reason" SET DATA TYPE VARCHAR(300);

-- CreateTable
CREATE TABLE "AccountRecoveryRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "nicSubmittedEncrypted" TEXT NOT NULL,
    "legalNameSubmitted" VARCHAR(100) NOT NULL,
    "birthdateSubmitted" DATE NOT NULL,
    "deviceId" TEXT NOT NULL,
    "status" "AccountRecoveryStatus" NOT NULL DEFAULT 'AWAITING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedByAdminAccountId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AccountRecoveryRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingRemovalRequest" (
    "id" TEXT NOT NULL,
    "ratingId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "grounds" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ruledAt" TIMESTAMP(3),

    CONSTRAINT "RatingRemovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountRecoveryRequest_status_createdAt_idx" ON "AccountRecoveryRequest"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RatingRemovalRequest_ratingId_key" ON "RatingRemovalRequest"("ratingId");

-- AddForeignKey
ALTER TABLE "AccountRecoveryRequest" ADD CONSTRAINT "AccountRecoveryRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountRecoveryRequest" ADD CONSTRAINT "AccountRecoveryRequest_reviewedByAdminAccountId_fkey" FOREIGN KEY ("reviewedByAdminAccountId") REFERENCES "AdminAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingRemovalRequest" ADD CONSTRAINT "RatingRemovalRequest_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingRemovalRequest" ADD CONSTRAINT "RatingRemovalRequest_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
