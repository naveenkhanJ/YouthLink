-- Fan-out targeting (2026-09-25). FR-POST-10, FR-NOTIF-01 and FR-NOTIF-02 send
-- gig notifications to youth "within the search radius", but nothing stored
-- where a youth is. These three nullable columns hold the centre of the
-- worker's most recent Browse search, rounded to about 1 km and overwritten on
-- every browse. Additive and nullable: existing rows are unaffected.

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastBrowseAt" TIMESTAMP(3),
ADD COLUMN     "lastBrowseLat" DOUBLE PRECISION,
ADD COLUMN     "lastBrowseLng" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "User_lastBrowseLat_lastBrowseLng_idx" ON "User"("lastBrowseLat", "lastBrowseLng");
