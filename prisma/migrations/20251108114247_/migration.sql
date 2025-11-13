/*
  Warnings:

  - The values [wherehouse] on the enum `BranchType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BranchType_new" AS ENUM ('office', 'warehouse');
ALTER TABLE "public"."Branch" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Branch" ALTER COLUMN "type" TYPE "BranchType_new" USING ("type"::text::"BranchType_new");
ALTER TYPE "BranchType" RENAME TO "BranchType_old";
ALTER TYPE "BranchType_new" RENAME TO "BranchType";
DROP TYPE "public"."BranchType_old";
ALTER TABLE "Branch" ALTER COLUMN "type" SET DEFAULT 'office';
COMMIT;
