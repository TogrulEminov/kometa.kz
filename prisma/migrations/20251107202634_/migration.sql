-- CreateTable
CREATE TABLE "PhotoGallery" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "PhotoGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoGalleryTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotoGalleryTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_photoGalleryFiles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_photoGalleryFiles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhotoGallery_documentId_key" ON "PhotoGallery"("documentId");

-- CreateIndex
CREATE INDEX "PhotoGallery_isDeleted_idx" ON "PhotoGallery"("isDeleted");

-- CreateIndex
CREATE INDEX "PhotoGallery_status_idx" ON "PhotoGallery"("status");

-- CreateIndex
CREATE INDEX "PhotoGallery_createdAt_idx" ON "PhotoGallery"("createdAt");

-- CreateIndex
CREATE INDEX "PhotoGallery_userId_idx" ON "PhotoGallery"("userId");

-- CreateIndex
CREATE INDEX "PhotoGallery_isDeleted_status_idx" ON "PhotoGallery"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "PhotoGallery_isDeleted_createdAt_idx" ON "PhotoGallery"("isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "PhotoGalleryTranslations_locale_idx" ON "PhotoGalleryTranslations"("locale");

-- CreateIndex
CREATE INDEX "PhotoGalleryTranslations_documentId_idx" ON "PhotoGalleryTranslations"("documentId");

-- CreateIndex
CREATE INDEX "PhotoGalleryTranslations_slug_idx" ON "PhotoGalleryTranslations"("slug");

-- CreateIndex
CREATE INDEX "PhotoGalleryTranslations_title_idx" ON "PhotoGalleryTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoGalleryTranslations_documentId_locale_key" ON "PhotoGalleryTranslations"("documentId", "locale");

-- CreateIndex
CREATE INDEX "_photoGalleryFiles_B_index" ON "_photoGalleryFiles"("B");

-- AddForeignKey
ALTER TABLE "PhotoGallery" ADD CONSTRAINT "PhotoGallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoGalleryTranslations" ADD CONSTRAINT "PhotoGalleryTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "PhotoGallery"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_photoGalleryFiles" ADD CONSTRAINT "_photoGalleryFiles_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_photoGalleryFiles" ADD CONSTRAINT "_photoGalleryFiles_B_fkey" FOREIGN KEY ("B") REFERENCES "PhotoGallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
