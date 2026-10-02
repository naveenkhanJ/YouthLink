-- ---------------------------------------------------------------------------
-- Partial unique index (hand-written; Prisma schema syntax cannot express
-- a WHERE clause on a unique index).
--
-- FR-ENDORSE-08 as amended 2026-09-24: one ACTIVE endorsement per endorser per
-- worker, so a repeated vouch cannot count twice in "Endorsed ×n" or in the
-- endorser's track record. It is partial because a revoked endorsement may be
-- replaced while the worker is still eligible.
--
-- Do not replace this with @@unique in schema.prisma — that would also forbid
-- the replacement, which is wrong.
--
-- It runs FIRST because it is the only statement here that existing data can
-- make fail (a database already holding two active endorsements of the same
-- worker by the same endorser). Failing before the enum changes leaves nothing
-- half-applied, whether or not the migration runs inside a transaction.
-- ---------------------------------------------------------------------------

CREATE UNIQUE INDEX "Endorsement_endorser_worker_active_unique"
  ON "Endorsement"("endorserId", "workerId")
  WHERE "revokedAt" IS NULL;

-- AlterEnum
ALTER TYPE "CheckpointStatus" ADD VALUE 'SETTLED_BY_RULING';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'APPLICATION_TERMS_CHANGED';
ALTER TYPE "NotificationType" ADD VALUE 'WARNING_RECORDED';
ALTER TYPE "NotificationType" ADD VALUE 'ENDORSEMENT_REVOKED';
