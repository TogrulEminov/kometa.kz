/*
  Warnings:

  - You are about to drop the `_photoGalleryFiles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `PhotoGallery` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."_photoGalleryFiles" DROP CONSTRAINT "_photoGalleryFiles_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_photoGalleryFiles" DROP CONSTRAINT "_photoGalleryFiles_B_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "photoGalleryid" INTEGER;

-- AlterTable
ALTER TABLE "PhotoGallery" ADD COLUMN     "imageId" INTEGER;

-- DropTable
DROP TABLE "public"."_photoGalleryFiles";

-- CreateIndex
CREATE UNIQUE INDEX "PhotoGallery_imageId_key" ON "PhotoGallery"("imageId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_photoGalleryid_fkey" FOREIGN KEY ("photoGalleryid") REFERENCES "PhotoGallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoGallery" ADD CONSTRAINT "PhotoGallery_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
