-- CreateEnum
CREATE TYPE "ActorRole" AS ENUM ('YOUTH_JOB_SEEKER', 'EMPLOYER', 'COMMUNITY_ENDORSER');

-- CreateEnum
CREATE TYPE "PostingAsType" AS ENUM ('INDIVIDUAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING_SIGNUP', 'ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('SIGNUP', 'LOGIN', 'PASSWORD_RESET', 'PHONE_CHANGE', 'ADMIN_LOGIN');

-- CreateEnum
CREATE TYPE "EmailTokenPurpose" AS ENUM ('SIGNUP', 'EMAIL_CHANGE', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "GigCategory" AS ENUM ('RETAIL', 'DELIVERY', 'EVENT_SETUP', 'MOVING', 'FOOD_SERVICE', 'TUTORING', 'CLEANING');

-- CreateEnum
CREATE TYPE "ArrangementType" AS ENUM ('GIG', 'PART_TIME', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "PayKind" AS ENUM ('FIXED_TOTAL', 'RATE', 'UNPAID', 'STIPEND', 'PAID');

-- CreateEnum
CREATE TYPE "PayRateUnit" AS ENUM ('DAY', 'WEEK', 'MONTH');

-- CreateEnum
CREATE TYPE "GigStatus" AS ENUM ('OPEN', 'FILLED', 'WITHDRAWN', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MaterialChangeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED_ROUTED_TO_CANCELLATION');

-- CreateEnum
CREATE TYPE "CancellationRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'AUTO_RESOLVED_NO_RESPONSE', 'IMMEDIATE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'SELECTED', 'DECLINED', 'WITHDRAWN', 'NOT_SELECTED');

-- CreateEnum
CREATE TYPE "EngagementStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'ENDED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "CheckpointStatus" AS ENUM ('PENDING', 'CONFIRMED', 'UNABLE_TO_CONFIRM');

-- CreateEnum
CREATE TYPE "CancellationReason" AS ENUM ('SCHEDULE_CONFLICT', 'DETAILS_NO_LONGER_SUITABLE', 'FOUND_OTHER_WORK', 'PERSONAL_EMERGENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "CompletionOutcome" AS ENUM ('COMPLETED', 'LATE_CANCELLATION', 'EARLY_CANCELLATION', 'NO_SHOW_RELIABLE_CREDIT', 'NO_SHOW_UNRELIABLE_MARK');

-- CreateEnum
CREATE TYPE "EndorsementEntryPoint" AS ENUM ('CODE', 'PHONE_SEARCH');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('FRAUD_SCAM', 'INAPPROPRIATE_CONTENT', 'SAFETY_CONCERN', 'HARASSMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('QUEUED', 'REVIEWED');

-- CreateEnum
CREATE TYPE "DisputeTriggerType" AS ENUM ('UNABLE_TO_CONFIRM', 'END_ENGAGEMENT_ISSUE', 'STALLED_AUTO_FLAG', 'REPORT');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('AWAITING_RESPONSE', 'UNDER_REVIEW', 'ESCALATED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "DisputeResolution" AS ENUM ('RULED_FOR_RAISER', 'RULED_FOR_OTHER', 'INCONCLUSIVE', 'WARNING_ONLY', 'NO_SHOW_CONFIRMED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('URGENT_GIG', 'NEW_GIG', 'URGENT_DIGEST', 'APPLICATION_RECEIVED', 'APPLICATION_SELECTED', 'APPLICATION_DECLINED', 'APPLICATION_NOT_SELECTED', 'MATERIAL_CHANGE', 'CANCELLATION_REQUEST', 'END_ENGAGEMENT', 'STALLED_ENGAGEMENT_PROMPT', 'NEW_DISPUTE_CASE', 'CLARIFICATION_REQUEST', 'ENDORSEMENT_RECEIVED', 'ENDORSEMENT_PAYOFF', 'NO_APPLICANT_NUDGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "ActorRole" NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneVerifiedAt" TIMESTAMP(3),
    "passwordHash" TEXT NOT NULL,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "email" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "nicEncrypted" TEXT NOT NULL,
    "nicLast4" VARCHAR(4) NOT NULL,
    "legalName" VARCHAR(100) NOT NULL,
    "birthdate" DATE NOT NULL,
    "postingAsType" "PostingAsType",
    "businessName" VARCHAR(100),
    "businessBio" VARCHAR(300),
    "bio" VARCHAR(300),
    "bioPromptShownAt" TIMESTAMP(3),
    "endorsementSuggestionShownAt" TIMESTAMP(3),
    "notifyUrgentOptIn" BOOLEAN NOT NULL DEFAULT false,
    "notifyNewGigOptOut" BOOLEAN NOT NULL DEFAULT false,
    "tosAcceptedAt" TIMESTAMP(3),
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'PENDING_SIGNUP',
    "signupExpiresAt" TIMESTAMP(3),
    "endorsementCode" VARCHAR(6),
    "firstRatingReceivedAt" TIMESTAMP(3),
    "autoHiddenAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "suspensionReason" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userId" TEXT,
    "adminAccountId" TEXT,
    "code" VARCHAR(6) NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "purpose" "EmailTokenPurpose" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAccount" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "role" "AdminRole" NOT NULL,
    "promotedByAdminAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GigPosting" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "category" "GigCategory" NOT NULL,
    "arrangementType" "ArrangementType" NOT NULL,
    "payKind" "PayKind" NOT NULL,
    "payAmount" DECIMAL(12,2),
    "payRateUnit" "PayRateUnit",
    "postedAsType" "PostingAsType" NOT NULL,
    "postedBusinessName" VARCHAR(100),
    "postedBusinessBio" VARCHAR(300),
    "locationAddress" TEXT NOT NULL,
    "locationLat" DOUBLE PRECISION NOT NULL,
    "locationLng" DOUBLE PRECISION NOT NULL,
    "locationAreaLabel" TEXT NOT NULL,
    "workersNeeded" INTEGER NOT NULL DEFAULT 1,
    "filledCount" INTEGER NOT NULL DEFAULT 0,
    "startAt" TIMESTAMP(3) NOT NULL,
    "schedule" VARCHAR(200),
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "status" "GigStatus" NOT NULL DEFAULT 'OPEN',
    "noApplicantNudgeSentAt" TIMESTAMP(3),
    "autoHiddenAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GigPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedGig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gigPostingId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedGig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialChangeRequest" (
    "id" TEXT NOT NULL,
    "gigPostingId" TEXT NOT NULL,
    "engagementId" TEXT NOT NULL,
    "changeSummary" JSONB NOT NULL,
    "proposedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "MaterialChangeStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "MaterialChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "gigPostingId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "note" VARCHAR(300),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Engagement" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "gigPostingId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "status" "EngagementStatus" NOT NULL DEFAULT 'ACTIVE',
    "contactRevealedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arrivalCode" VARCHAR(6),
    "arrivalStatus" "CheckpointStatus" NOT NULL DEFAULT 'PENDING',
    "arrivalConfirmedAt" TIMESTAMP(3),
    "completionCode" VARCHAR(6),
    "completionStatus" "CheckpointStatus" NOT NULL DEFAULT 'PENDING',
    "completionConfirmedAt" TIMESTAMP(3),
    "paymentCode" VARCHAR(6),
    "paymentStatus" "CheckpointStatus",
    "paymentConfirmedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "ratingOpenedAt" TIMESTAMP(3),
    "ratingEnforced" BOOLEAN NOT NULL DEFAULT true,
    "cancelledAt" TIMESTAMP(3),
    "cancelledByUserId" TEXT,
    "cancellationReason" "CancellationReason",
    "isLateCancellation" BOOLEAN,
    "endedAt" TIMESTAMP(3),
    "endedByUserId" TEXT,
    "endIssueFlag" BOOLEAN,
    "stalledPromptSentAt" TIMESTAMP(3),
    "stalledFlaggedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CancellationRequest" (
    "id" TEXT NOT NULL,
    "engagementId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "reason" "CancellationReason" NOT NULL,
    "isUrgentEngagement" BOOLEAN NOT NULL,
    "deadline" TIMESTAMP(3),
    "status" "CancellationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "CancellationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "engagementId" TEXT NOT NULL,
    "raterId" TEXT NOT NULL,
    "rateeId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revealedAt" TIMESTAMP(3),
    "publicResponse" TEXT,
    "removedAt" TIMESTAMP(3),
    "removedByAdminAccountId" TEXT,
    "removalReason" TEXT,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletionRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "engagementId" TEXT NOT NULL,
    "outcome" "CompletionOutcome" NOT NULL,
    "weight" DECIMAL(4,2) NOT NULL DEFAULT 1.0,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompletionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endorsement" (
    "id" TEXT NOT NULL,
    "endorserId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "reason" VARCHAR(300),
    "entryPoint" "EndorsementEntryPoint" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "Endorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetUserId" TEXT,
    "targetGigPostingId" TEXT,
    "targetEngagementId" TEXT,
    "reason" "ReportReason" NOT NULL,
    "detail" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'QUEUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisputeCase" (
    "id" TEXT NOT NULL,
    "engagementId" TEXT,
    "reportId" TEXT,
    "triggerType" "DisputeTriggerType" NOT NULL,
    "raisedByUserId" TEXT,
    "respondentUserId" TEXT,
    "respondentDeadline" TIMESTAMP(3),
    "status" "DisputeStatus" NOT NULL DEFAULT 'AWAITING_RESPONSE',
    "moderatorAccountId" TEXT,
    "adminAccountId" TEXT,
    "resolution" "DisputeResolution",
    "resolutionNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisputeCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisputeEvidence" (
    "id" TEXT NOT NULL,
    "disputeCaseId" TEXT NOT NULL,
    "submittedByUserId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisputeEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisputeClarificationRequest" (
    "id" TEXT NOT NULL,
    "disputeCaseId" TEXT NOT NULL,
    "requestedByAdminAccountId" TEXT NOT NULL,
    "requestedFromUserId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "response" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisputeClarificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warning" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "disputeCaseId" TEXT,
    "issuedByAdminAccountId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLogEntry" (
    "id" TEXT NOT NULL,
    "adminAccountId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "adminAccountId" TEXT,
    "type" "NotificationType" NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "pushSentAt" TIMESTAMP(3),
    "batchedDigestId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_endorsementCode_key" ON "User"("endorsementCode");

-- CreateIndex
CREATE INDEX "User_accountStatus_idx" ON "User"("accountStatus");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "OtpCode_phone_idx" ON "OtpCode"("phone");

-- CreateIndex
CREATE INDEX "OtpCode_userId_idx" ON "OtpCode"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_token_key" ON "EmailVerificationToken"("token");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAccount_phone_key" ON "AdminAccount"("phone");

-- CreateIndex
CREATE INDEX "GigPosting_status_category_arrangementType_idx" ON "GigPosting"("status", "category", "arrangementType");

-- CreateIndex
CREATE INDEX "GigPosting_locationLat_locationLng_idx" ON "GigPosting"("locationLat", "locationLng");

-- CreateIndex
CREATE INDEX "GigPosting_startAt_idx" ON "GigPosting"("startAt");

-- CreateIndex
CREATE INDEX "GigPosting_employerId_idx" ON "GigPosting"("employerId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedGig_userId_gigPostingId_key" ON "SavedGig"("userId", "gigPostingId");

-- CreateIndex
CREATE INDEX "MaterialChangeRequest_engagementId_idx" ON "MaterialChangeRequest"("engagementId");

-- CreateIndex
CREATE INDEX "Application_gigPostingId_status_idx" ON "Application"("gigPostingId", "status");

-- CreateIndex
CREATE INDEX "Application_workerId_idx" ON "Application"("workerId");

-- CreateIndex
CREATE UNIQUE INDEX "Engagement_applicationId_key" ON "Engagement"("applicationId");

-- CreateIndex
CREATE INDEX "Engagement_workerId_status_idx" ON "Engagement"("workerId", "status");

-- CreateIndex
CREATE INDEX "Engagement_employerId_status_idx" ON "Engagement"("employerId", "status");

-- CreateIndex
CREATE INDEX "Engagement_gigPostingId_idx" ON "Engagement"("gigPostingId");

-- CreateIndex
CREATE INDEX "CancellationRequest_engagementId_idx" ON "CancellationRequest"("engagementId");

-- CreateIndex
CREATE INDEX "Rating_rateeId_revealedAt_idx" ON "Rating"("rateeId", "revealedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_engagementId_raterId_key" ON "Rating"("engagementId", "raterId");

-- CreateIndex
CREATE INDEX "CompletionRecord_userId_idx" ON "CompletionRecord"("userId");

-- CreateIndex
CREATE INDEX "Endorsement_workerId_revokedAt_idx" ON "Endorsement"("workerId", "revokedAt");

-- CreateIndex
CREATE INDEX "Endorsement_endorserId_revokedAt_idx" ON "Endorsement"("endorserId", "revokedAt");

-- CreateIndex
CREATE INDEX "Report_targetUserId_idx" ON "Report"("targetUserId");

-- CreateIndex
CREATE INDEX "Report_targetGigPostingId_idx" ON "Report"("targetGigPostingId");

-- CreateIndex
CREATE UNIQUE INDEX "DisputeCase_reportId_key" ON "DisputeCase"("reportId");

-- CreateIndex
CREATE INDEX "DisputeCase_status_idx" ON "DisputeCase"("status");

-- CreateIndex
CREATE INDEX "DisputeCase_engagementId_idx" ON "DisputeCase"("engagementId");

-- CreateIndex
CREATE INDEX "DisputeEvidence_disputeCaseId_idx" ON "DisputeEvidence"("disputeCaseId");

-- CreateIndex
CREATE INDEX "DisputeClarificationRequest_disputeCaseId_idx" ON "DisputeClarificationRequest"("disputeCaseId");

-- CreateIndex
CREATE INDEX "Warning_userId_issuedAt_idx" ON "Warning"("userId", "issuedAt");

-- CreateIndex
CREATE INDEX "AuditLogEntry_adminAccountId_createdAt_idx" ON "AuditLogEntry"("adminAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Notification_adminAccountId_readAt_idx" ON "Notification"("adminAccountId", "readAt");

-- AddForeignKey
ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_adminAccountId_fkey" FOREIGN KEY ("adminAccountId") REFERENCES "AdminAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAccount" ADD CONSTRAINT "AdminAccount_promotedByAdminAccountId_fkey" FOREIGN KEY ("promotedByAdminAccountId") REFERENCES "AdminAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GigPosting" ADD CONSTRAINT "GigPosting_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedGig" ADD CONSTRAINT "SavedGig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedGig" ADD CONSTRAINT "SavedGig_gigPostingId_fkey" FOREIGN KEY ("gigPostingId") REFERENCES "GigPosting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialChangeRequest" ADD CONSTRAINT "MaterialChangeRequest_gigPostingId_fkey" FOREIGN KEY ("gigPostingId") REFERENCES "GigPosting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialChangeRequest" ADD CONSTRAINT "MaterialChangeRequest_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "Engagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_gigPostingId_fkey" FOREIGN KEY ("gigPostingId") REFERENCES "GigPosting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_gigPostingId_fkey" FOREIGN KEY ("gigPostingId") REFERENCES "GigPosting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_cancelledByUserId_fkey" FOREIGN KEY ("cancelledByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_endedByUserId_fkey" FOREIGN KEY ("endedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CancellationRequest" ADD CONSTRAINT "CancellationRequest_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "Engagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CancellationRequest" ADD CONSTRAINT "CancellationRequest_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "Engagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_rateeId_fkey" FOREIGN KEY ("rateeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_removedByAdminAccountId_fkey" FOREIGN KEY ("removedByAdminAccountId") REFERENCES "AdminAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionRecord" ADD CONSTRAINT "CompletionRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionRecord" ADD CONSTRAINT "CompletionRecord_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "Engagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_endorserId_fkey" FOREIGN KEY ("endorserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_targetGigPostingId_fkey" FOREIGN KEY ("targetGigPostingId") REFERENCES "GigPosting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_targetEngagementId_fkey" FOREIGN KEY ("targetEngagementId") REFERENCES "Engagement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeCase" ADD CONSTRAINT "DisputeCase_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "Engagement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeCase" ADD CONSTRAINT "DisputeCase_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeCase" ADD CONSTRAINT "DisputeCase_raisedByUserId_fkey" FOREIGN KEY ("raisedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeCase" ADD CONSTRAINT "DisputeCase_respondentUserId_fkey" FOREIGN KEY ("respondentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeCase" ADD CONSTRAINT "DisputeCase_moderatorAccountId_fkey" FOREIGN KEY ("moderatorAccountId") REFERENCES "AdminAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeCase" ADD CONSTRAINT "DisputeCase_adminAccountId_fkey" FOREIGN KEY ("adminAccountId") REFERENCES "AdminAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeEvidence" ADD CONSTRAINT "DisputeEvidence_disputeCaseId_fkey" FOREIGN KEY ("disputeCaseId") REFERENCES "DisputeCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeEvidence" ADD CONSTRAINT "DisputeEvidence_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeClarificationRequest" ADD CONSTRAINT "DisputeClarificationRequest_disputeCaseId_fkey" FOREIGN KEY ("disputeCaseId") REFERENCES "DisputeCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeClarificationRequest" ADD CONSTRAINT "DisputeClarificationRequest_requestedByAdminAccountId_fkey" FOREIGN KEY ("requestedByAdminAccountId") REFERENCES "AdminAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeClarificationRequest" ADD CONSTRAINT "DisputeClarificationRequest_requestedFromUserId_fkey" FOREIGN KEY ("requestedFromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_disputeCaseId_fkey" FOREIGN KEY ("disputeCaseId") REFERENCES "DisputeCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_issuedByAdminAccountId_fkey" FOREIGN KEY ("issuedByAdminAccountId") REFERENCES "AdminAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogEntry" ADD CONSTRAINT "AuditLogEntry_adminAccountId_fkey" FOREIGN KEY ("adminAccountId") REFERENCES "AdminAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_adminAccountId_fkey" FOREIGN KEY ("adminAccountId") REFERENCES "AdminAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_batchedDigestId_fkey" FOREIGN KEY ("batchedDigestId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Partial unique indexes (hand-written; Prisma schema syntax cannot express
-- a WHERE clause on a unique index).
--
-- FR-ACC-05 scopes uniqueness to *verified* phone and email only, so an
-- unconfirmed value never blocks anyone else. FR-ACC-06 requires an abandoned
-- signup to release its phone number. Soft-deleted accounts (FR-ACC-17) hold
-- anonymised placeholders that must not collide.
--
-- Do not replace these with @unique in schema.prisma — that would enforce
-- uniqueness on unverified and deleted rows too, which is wrong.
-- ---------------------------------------------------------------------------

CREATE UNIQUE INDEX "User_phone_verified_unique"
  ON "User"("phone")
  WHERE "phoneVerifiedAt" IS NOT NULL AND "deletedAt" IS NULL;

CREATE UNIQUE INDEX "User_email_verified_unique"
  ON "User"("email")
  WHERE "emailVerifiedAt" IS NOT NULL AND "deletedAt" IS NULL;

CREATE UNIQUE INDEX "User_nic_unique"
  ON "User"("nicEncrypted")
  WHERE "deletedAt" IS NULL;
