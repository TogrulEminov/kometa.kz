/*
  Warnings:

  - You are about to drop the column `type` on the `Branch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "type" "BranchType" DEFAULT 'office';
