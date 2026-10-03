-- CreateEnum
CREATE TYPE "EndorsementAttribute" AS ENUM ('PUNCTUALITY', 'HONESTY', 'RELIABILITY', 'SPECIFIC_SKILL', 'LENGTH_OF_ACQUAINTANCE');

-- AlterTable
ALTER TABLE "Endorsement" ADD COLUMN     "attributes" "EndorsementAttribute"[] DEFAULT ARRAY[]::"EndorsementAttribute"[];
