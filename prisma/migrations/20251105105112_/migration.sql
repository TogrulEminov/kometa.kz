-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('published', 'draft');

-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('office', 'wherehouse');

-- CreateEnum
CREATE TYPE "BranchStatus" AS ENUM ('ACTIVE', 'PLANNED');

-- CreateEnum
CREATE TYPE "Locales" AS ENUM ('az', 'tr', 'ru', 'en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'uk', 'cs', 'sk', 'ro', 'bg', 'el', 'sv', 'no', 'da', 'fi', 'hu', 'zh', 'ja', 'ko', 'hi', 'th', 'vi', 'id', 'ms', 'ar', 'fa', 'he', 'bn', 'ur', 'sw', 'am', 'kk', 'uz', 'ky', 'tg', 'tk', 'ka', 'hy', 'be', 'sr', 'hr', 'bs', 'sl', 'mk', 'sq');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdById" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "fileKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seo" (
    "id" SERIAL NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "metaKeywords" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "imageId" INTEGER,

    CONSTRAINT "Seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" SERIAL NOT NULL,
    "socialName" TEXT NOT NULL,
    "socialLink" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriesTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "seoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoriesTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "view" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "readTime" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "seoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogView" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionContent" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "key" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "orderNumber" INTEGER DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SectionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionContentTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "subTitle" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "SectionContentTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "orderNumber" INTEGER DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "FaqTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advantages" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Advantages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvantagesTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdvantagesTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkProcess" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "orderNumber" INTEGER DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkProcessTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "WorkProcessTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistics" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "count" INTEGER NOT NULL DEFAULT 0,
    "orderNumber" INTEGER DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatisticsTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "StatisticsTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slider" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Slider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SliderTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SliderTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallAction" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "typesProduct" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,

    CONSTRAINT "CallAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "status" "BranchStatus" NOT NULL DEFAULT 'ACTIVE',
    "type" "BranchType" DEFAULT 'office',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchTranslation" (
    "id" SERIAL NOT NULL,
    "countryName" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Office" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeTranslation" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "locale" "Locales" NOT NULL,
    "officeDocumentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "highlightWord" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "primaryButton" TEXT NOT NULL,
    "secondaryButton" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "statistics" JSONB NOT NULL,
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Youtube" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Youtube_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificates" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificatesTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificatesTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonials" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "rate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company" TEXT,
    "userId" TEXT,

    CONSTRAINT "Testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonialsTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "nameSurname" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestimonialsTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partners" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnersTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnersTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Features" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "videoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturesTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturesTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "orderNumber" INTEGER DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PositionTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "imageId" INTEGER,
    "experience" INTEGER NOT NULL,
    "orderNumber" INTEGER DEFAULT 0,
    "email" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "emailResponse" BOOLEAN DEFAULT false,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "positionId" INTEGER NOT NULL,
    "contactEnumTranslationsId" INTEGER,

    CONSTRAINT "EmployeeTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "About" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "features" JSONB NOT NULL,
    "advantages" JSONB NOT NULL,
    "statistics" JSONB NOT NULL,
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "imageId" INTEGER,
    "iconsId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderNumber" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "advantages" JSONB NOT NULL,
    "fags" JSONB NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "seoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicesTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionCta" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "key" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "orderNumber" INTEGER DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SectionCta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionCtaTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "subTitle" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "SectionCtaTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInformation" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneSecond" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "adressLink" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContactInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInformationTranslation" (
    "id" SERIAL NOT NULL,
    "adress" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "workHours" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "tag" TEXT,
    "support" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInformationTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceOffer" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "assignedTo" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "typesProduct" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactUs" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'published',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactEnum" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "orderNumber" INTEGER DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContactEnum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactEnumTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'az',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactEnumTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_isDeleted_idx" ON "User"("isDeleted");

-- CreateIndex
CREATE INDEX "User_email_username_idx" ON "User"("email", "username");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_createdById_idx" ON "User"("createdById");

-- CreateIndex
CREATE INDEX "User_updatedById_idx" ON "User"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_expires_idx" ON "VerificationToken"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "File_fileKey_key" ON "File"("fileKey");

-- CreateIndex
CREATE INDEX "File_createdAt_idx" ON "File"("createdAt");

-- CreateIndex
CREATE INDEX "File_mimeType_idx" ON "File"("mimeType");

-- CreateIndex
CREATE UNIQUE INDEX "Seo_imageId_key" ON "Seo"("imageId");

-- CreateIndex
CREATE INDEX "Seo_locale_idx" ON "Seo"("locale");

-- CreateIndex
CREATE INDEX "Seo_imageId_idx" ON "Seo"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Social_socialName_key" ON "Social"("socialName");

-- CreateIndex
CREATE UNIQUE INDEX "Social_socialLink_key" ON "Social"("socialLink");

-- CreateIndex
CREATE UNIQUE INDEX "Social_documentId_key" ON "Social"("documentId");

-- CreateIndex
CREATE INDEX "Social_status_idx" ON "Social"("status");

-- CreateIndex
CREATE INDEX "Social_createdAt_idx" ON "Social"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_documentId_key" ON "Categories"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_imageId_key" ON "Categories"("imageId");

-- CreateIndex
CREATE INDEX "Categories_isDeleted_idx" ON "Categories"("isDeleted");

-- CreateIndex
CREATE INDEX "Categories_status_idx" ON "Categories"("status");

-- CreateIndex
CREATE INDEX "Categories_slug_idx" ON "Categories"("slug");

-- CreateIndex
CREATE INDEX "Categories_createdAt_idx" ON "Categories"("createdAt");

-- CreateIndex
CREATE INDEX "Categories_userId_idx" ON "Categories"("userId");

-- CreateIndex
CREATE INDEX "Categories_isDeleted_status_idx" ON "Categories"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "CategoriesTranslations_locale_idx" ON "CategoriesTranslations"("locale");

-- CreateIndex
CREATE INDEX "CategoriesTranslations_documentId_idx" ON "CategoriesTranslations"("documentId");

-- CreateIndex
CREATE INDEX "CategoriesTranslations_seoId_idx" ON "CategoriesTranslations"("seoId");

-- CreateIndex
CREATE INDEX "CategoriesTranslations_title_idx" ON "CategoriesTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriesTranslations_documentId_locale_key" ON "CategoriesTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_documentId_key" ON "Blog"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_imageId_key" ON "Blog"("imageId");

-- CreateIndex
CREATE INDEX "Blog_isDeleted_idx" ON "Blog"("isDeleted");

-- CreateIndex
CREATE INDEX "Blog_status_idx" ON "Blog"("status");

-- CreateIndex
CREATE INDEX "Blog_createdAt_idx" ON "Blog"("createdAt");

-- CreateIndex
CREATE INDEX "Blog_userId_idx" ON "Blog"("userId");

-- CreateIndex
CREATE INDEX "Blog_view_idx" ON "Blog"("view");

-- CreateIndex
CREATE INDEX "Blog_isDeleted_status_idx" ON "Blog"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "Blog_isDeleted_createdAt_idx" ON "Blog"("isDeleted", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogTranslations_slug_key" ON "BlogTranslations"("slug");

-- CreateIndex
CREATE INDEX "BlogTranslations_locale_idx" ON "BlogTranslations"("locale");

-- CreateIndex
CREATE INDEX "BlogTranslations_documentId_idx" ON "BlogTranslations"("documentId");

-- CreateIndex
CREATE INDEX "BlogTranslations_slug_idx" ON "BlogTranslations"("slug");

-- CreateIndex
CREATE INDEX "BlogTranslations_seoId_idx" ON "BlogTranslations"("seoId");

-- CreateIndex
CREATE INDEX "BlogTranslations_title_idx" ON "BlogTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "BlogTranslations_documentId_locale_key" ON "BlogTranslations"("documentId", "locale");

-- CreateIndex
CREATE INDEX "BlogView_blogId_idx" ON "BlogView"("blogId");

-- CreateIndex
CREATE INDEX "BlogView_viewedAt_idx" ON "BlogView"("viewedAt");

-- CreateIndex
CREATE INDEX "BlogView_ipAddress_idx" ON "BlogView"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "BlogView_blogId_ipAddress_key" ON "BlogView"("blogId", "ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "SectionContent_documentId_key" ON "SectionContent"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "SectionContent_key_key" ON "SectionContent"("key");

-- CreateIndex
CREATE INDEX "SectionContent_isDeleted_idx" ON "SectionContent"("isDeleted");

-- CreateIndex
CREATE INDEX "SectionContent_createdAt_idx" ON "SectionContent"("createdAt");

-- CreateIndex
CREATE INDEX "SectionContent_status_idx" ON "SectionContent"("status");

-- CreateIndex
CREATE INDEX "SectionContent_key_idx" ON "SectionContent"("key");

-- CreateIndex
CREATE INDEX "SectionContent_userId_idx" ON "SectionContent"("userId");

-- CreateIndex
CREATE INDEX "SectionContent_orderNumber_idx" ON "SectionContent"("orderNumber");

-- CreateIndex
CREATE INDEX "SectionContent_isDeleted_status_idx" ON "SectionContent"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "SectionContent_isDeleted_key_idx" ON "SectionContent"("isDeleted", "key");

-- CreateIndex
CREATE INDEX "SectionContentTranslations_title_idx" ON "SectionContentTranslations"("title");

-- CreateIndex
CREATE INDEX "SectionContentTranslations_locale_idx" ON "SectionContentTranslations"("locale");

-- CreateIndex
CREATE INDEX "SectionContentTranslations_documentId_idx" ON "SectionContentTranslations"("documentId");

-- CreateIndex
CREATE INDEX "SectionContentTranslations_slug_idx" ON "SectionContentTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SectionContentTranslations_documentId_locale_key" ON "SectionContentTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Faq_documentId_key" ON "Faq"("documentId");

-- CreateIndex
CREATE INDEX "Faq_isDeleted_idx" ON "Faq"("isDeleted");

-- CreateIndex
CREATE INDEX "Faq_createdAt_idx" ON "Faq"("createdAt");

-- CreateIndex
CREATE INDEX "Faq_status_idx" ON "Faq"("status");

-- CreateIndex
CREATE INDEX "Faq_userId_idx" ON "Faq"("userId");

-- CreateIndex
CREATE INDEX "Faq_orderNumber_idx" ON "Faq"("orderNumber");

-- CreateIndex
CREATE INDEX "Faq_isDeleted_status_idx" ON "Faq"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "Faq_isDeleted_createdAt_idx" ON "Faq"("isDeleted", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FaqTranslations_slug_key" ON "FaqTranslations"("slug");

-- CreateIndex
CREATE INDEX "FaqTranslations_title_idx" ON "FaqTranslations"("title");

-- CreateIndex
CREATE INDEX "FaqTranslations_locale_idx" ON "FaqTranslations"("locale");

-- CreateIndex
CREATE INDEX "FaqTranslations_documentId_idx" ON "FaqTranslations"("documentId");

-- CreateIndex
CREATE INDEX "FaqTranslations_slug_idx" ON "FaqTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FaqTranslations_documentId_locale_key" ON "FaqTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Advantages_documentId_key" ON "Advantages"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Advantages_imageId_key" ON "Advantages"("imageId");

-- CreateIndex
CREATE INDEX "Advantages_isDeleted_idx" ON "Advantages"("isDeleted");

-- CreateIndex
CREATE INDEX "Advantages_status_idx" ON "Advantages"("status");

-- CreateIndex
CREATE INDEX "Advantages_createdAt_idx" ON "Advantages"("createdAt");

-- CreateIndex
CREATE INDEX "Advantages_userId_idx" ON "Advantages"("userId");

-- CreateIndex
CREATE INDEX "Advantages_isDeleted_status_idx" ON "Advantages"("isDeleted", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AdvantagesTranslations_slug_key" ON "AdvantagesTranslations"("slug");

-- CreateIndex
CREATE INDEX "AdvantagesTranslations_locale_idx" ON "AdvantagesTranslations"("locale");

-- CreateIndex
CREATE INDEX "AdvantagesTranslations_documentId_idx" ON "AdvantagesTranslations"("documentId");

-- CreateIndex
CREATE INDEX "AdvantagesTranslations_slug_idx" ON "AdvantagesTranslations"("slug");

-- CreateIndex
CREATE INDEX "AdvantagesTranslations_title_idx" ON "AdvantagesTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "AdvantagesTranslations_documentId_locale_key" ON "AdvantagesTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "WorkProcess_documentId_key" ON "WorkProcess"("documentId");

-- CreateIndex
CREATE INDEX "WorkProcess_isDeleted_idx" ON "WorkProcess"("isDeleted");

-- CreateIndex
CREATE INDEX "WorkProcess_createdAt_idx" ON "WorkProcess"("createdAt");

-- CreateIndex
CREATE INDEX "WorkProcess_status_idx" ON "WorkProcess"("status");

-- CreateIndex
CREATE INDEX "WorkProcess_userId_idx" ON "WorkProcess"("userId");

-- CreateIndex
CREATE INDEX "WorkProcess_orderNumber_idx" ON "WorkProcess"("orderNumber");

-- CreateIndex
CREATE INDEX "WorkProcess_isDeleted_status_idx" ON "WorkProcess"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "WorkProcess_isDeleted_orderNumber_idx" ON "WorkProcess"("isDeleted", "orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WorkProcessTranslations_slug_key" ON "WorkProcessTranslations"("slug");

-- CreateIndex
CREATE INDEX "WorkProcessTranslations_title_idx" ON "WorkProcessTranslations"("title");

-- CreateIndex
CREATE INDEX "WorkProcessTranslations_locale_idx" ON "WorkProcessTranslations"("locale");

-- CreateIndex
CREATE INDEX "WorkProcessTranslations_documentId_idx" ON "WorkProcessTranslations"("documentId");

-- CreateIndex
CREATE INDEX "WorkProcessTranslations_slug_idx" ON "WorkProcessTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WorkProcessTranslations_documentId_locale_key" ON "WorkProcessTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Statistics_documentId_key" ON "Statistics"("documentId");

-- CreateIndex
CREATE INDEX "Statistics_isDeleted_idx" ON "Statistics"("isDeleted");

-- CreateIndex
CREATE INDEX "Statistics_createdAt_idx" ON "Statistics"("createdAt");

-- CreateIndex
CREATE INDEX "Statistics_status_idx" ON "Statistics"("status");

-- CreateIndex
CREATE INDEX "Statistics_userId_idx" ON "Statistics"("userId");

-- CreateIndex
CREATE INDEX "Statistics_orderNumber_idx" ON "Statistics"("orderNumber");

-- CreateIndex
CREATE INDEX "Statistics_count_idx" ON "Statistics"("count");

-- CreateIndex
CREATE INDEX "Statistics_isDeleted_status_idx" ON "Statistics"("isDeleted", "status");

-- CreateIndex
CREATE UNIQUE INDEX "StatisticsTranslations_slug_key" ON "StatisticsTranslations"("slug");

-- CreateIndex
CREATE INDEX "StatisticsTranslations_title_idx" ON "StatisticsTranslations"("title");

-- CreateIndex
CREATE INDEX "StatisticsTranslations_locale_idx" ON "StatisticsTranslations"("locale");

-- CreateIndex
CREATE INDEX "StatisticsTranslations_documentId_idx" ON "StatisticsTranslations"("documentId");

-- CreateIndex
CREATE INDEX "StatisticsTranslations_slug_idx" ON "StatisticsTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StatisticsTranslations_documentId_locale_key" ON "StatisticsTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Slider_documentId_key" ON "Slider"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Slider_imageId_key" ON "Slider"("imageId");

-- CreateIndex
CREATE INDEX "Slider_isDeleted_idx" ON "Slider"("isDeleted");

-- CreateIndex
CREATE INDEX "Slider_status_idx" ON "Slider"("status");

-- CreateIndex
CREATE INDEX "Slider_createdAt_idx" ON "Slider"("createdAt");

-- CreateIndex
CREATE INDEX "Slider_userId_idx" ON "Slider"("userId");

-- CreateIndex
CREATE INDEX "Slider_isDeleted_status_idx" ON "Slider"("isDeleted", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SliderTranslations_slug_key" ON "SliderTranslations"("slug");

-- CreateIndex
CREATE INDEX "SliderTranslations_locale_idx" ON "SliderTranslations"("locale");

-- CreateIndex
CREATE INDEX "SliderTranslations_documentId_idx" ON "SliderTranslations"("documentId");

-- CreateIndex
CREATE INDEX "SliderTranslations_slug_idx" ON "SliderTranslations"("slug");

-- CreateIndex
CREATE INDEX "SliderTranslations_title_idx" ON "SliderTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "SliderTranslations_documentId_locale_key" ON "SliderTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "CallAction_documentId_key" ON "CallAction"("documentId");

-- CreateIndex
CREATE INDEX "CallAction_email_idx" ON "CallAction"("email");

-- CreateIndex
CREATE INDEX "CallAction_phone_idx" ON "CallAction"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_documentId_key" ON "Branch"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_isoCode_key" ON "Branch"("isoCode");

-- CreateIndex
CREATE INDEX "Branch_isoCode_idx" ON "Branch"("isoCode");

-- CreateIndex
CREATE INDEX "Branch_status_idx" ON "Branch"("status");

-- CreateIndex
CREATE INDEX "Branch_isDeleted_idx" ON "Branch"("isDeleted");

-- CreateIndex
CREATE INDEX "Branch_createdAt_idx" ON "Branch"("createdAt");

-- CreateIndex
CREATE INDEX "Branch_userId_idx" ON "Branch"("userId");

-- CreateIndex
CREATE INDEX "Branch_isDeleted_status_idx" ON "Branch"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "BranchTranslation_locale_idx" ON "BranchTranslation"("locale");

-- CreateIndex
CREATE INDEX "BranchTranslation_documentId_idx" ON "BranchTranslation"("documentId");

-- CreateIndex
CREATE INDEX "BranchTranslation_countryName_idx" ON "BranchTranslation"("countryName");

-- CreateIndex
CREATE UNIQUE INDEX "BranchTranslation_documentId_locale_key" ON "BranchTranslation"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Office_documentId_key" ON "Office"("documentId");

-- CreateIndex
CREATE INDEX "Office_branchId_idx" ON "Office"("branchId");

-- CreateIndex
CREATE INDEX "Office_isDeleted_idx" ON "Office"("isDeleted");

-- CreateIndex
CREATE INDEX "Office_latitude_longitude_idx" ON "Office"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "OfficeTranslation_documentId_key" ON "OfficeTranslation"("documentId");

-- CreateIndex
CREATE INDEX "OfficeTranslation_officeDocumentId_idx" ON "OfficeTranslation"("officeDocumentId");

-- CreateIndex
CREATE INDEX "OfficeTranslation_locale_idx" ON "OfficeTranslation"("locale");

-- CreateIndex
CREATE INDEX "OfficeTranslation_city_idx" ON "OfficeTranslation"("city");

-- CreateIndex
CREATE UNIQUE INDEX "OfficeTranslation_officeDocumentId_locale_key" ON "OfficeTranslation"("officeDocumentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Hero_documentId_key" ON "Hero"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Hero_imageId_key" ON "Hero"("imageId");

-- CreateIndex
CREATE INDEX "Hero_isDeleted_idx" ON "Hero"("isDeleted");

-- CreateIndex
CREATE INDEX "Hero_status_idx" ON "Hero"("status");

-- CreateIndex
CREATE INDEX "Hero_createdAt_idx" ON "Hero"("createdAt");

-- CreateIndex
CREATE INDEX "Hero_userId_idx" ON "Hero"("userId");

-- CreateIndex
CREATE INDEX "Hero_isDeleted_status_idx" ON "Hero"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "HeroTranslations_locale_idx" ON "HeroTranslations"("locale");

-- CreateIndex
CREATE INDEX "HeroTranslations_documentId_idx" ON "HeroTranslations"("documentId");

-- CreateIndex
CREATE INDEX "HeroTranslations_slug_idx" ON "HeroTranslations"("slug");

-- CreateIndex
CREATE INDEX "HeroTranslations_title_idx" ON "HeroTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "HeroTranslations_documentId_locale_key" ON "HeroTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Youtube_documentId_key" ON "Youtube"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Youtube_imageId_key" ON "Youtube"("imageId");

-- CreateIndex
CREATE INDEX "Youtube_isDeleted_idx" ON "Youtube"("isDeleted");

-- CreateIndex
CREATE INDEX "Youtube_status_idx" ON "Youtube"("status");

-- CreateIndex
CREATE INDEX "Youtube_createdAt_idx" ON "Youtube"("createdAt");

-- CreateIndex
CREATE INDEX "Youtube_userId_idx" ON "Youtube"("userId");

-- CreateIndex
CREATE INDEX "Youtube_isDeleted_status_idx" ON "Youtube"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "Youtube_isDeleted_createdAt_idx" ON "Youtube"("isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "YoutubeTranslations_locale_idx" ON "YoutubeTranslations"("locale");

-- CreateIndex
CREATE INDEX "YoutubeTranslations_documentId_idx" ON "YoutubeTranslations"("documentId");

-- CreateIndex
CREATE INDEX "YoutubeTranslations_slug_idx" ON "YoutubeTranslations"("slug");

-- CreateIndex
CREATE INDEX "YoutubeTranslations_title_idx" ON "YoutubeTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeTranslations_documentId_locale_key" ON "YoutubeTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Certificates_documentId_key" ON "Certificates"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificates_imageId_key" ON "Certificates"("imageId");

-- CreateIndex
CREATE INDEX "Certificates_isDeleted_idx" ON "Certificates"("isDeleted");

-- CreateIndex
CREATE INDEX "Certificates_status_idx" ON "Certificates"("status");

-- CreateIndex
CREATE INDEX "Certificates_createdAt_idx" ON "Certificates"("createdAt");

-- CreateIndex
CREATE INDEX "Certificates_userId_idx" ON "Certificates"("userId");

-- CreateIndex
CREATE INDEX "Certificates_isDeleted_status_idx" ON "Certificates"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "CertificatesTranslations_locale_idx" ON "CertificatesTranslations"("locale");

-- CreateIndex
CREATE INDEX "CertificatesTranslations_documentId_idx" ON "CertificatesTranslations"("documentId");

-- CreateIndex
CREATE INDEX "CertificatesTranslations_slug_idx" ON "CertificatesTranslations"("slug");

-- CreateIndex
CREATE INDEX "CertificatesTranslations_title_idx" ON "CertificatesTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CertificatesTranslations_documentId_locale_key" ON "CertificatesTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Testimonials_documentId_key" ON "Testimonials"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Testimonials_imageId_key" ON "Testimonials"("imageId");

-- CreateIndex
CREATE INDEX "Testimonials_isDeleted_idx" ON "Testimonials"("isDeleted");

-- CreateIndex
CREATE INDEX "Testimonials_status_idx" ON "Testimonials"("status");

-- CreateIndex
CREATE INDEX "Testimonials_createdAt_idx" ON "Testimonials"("createdAt");

-- CreateIndex
CREATE INDEX "Testimonials_userId_idx" ON "Testimonials"("userId");

-- CreateIndex
CREATE INDEX "Testimonials_rate_idx" ON "Testimonials"("rate");

-- CreateIndex
CREATE INDEX "Testimonials_isDeleted_status_idx" ON "Testimonials"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "Testimonials_isDeleted_createdAt_idx" ON "Testimonials"("isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "TestimonialsTranslations_locale_idx" ON "TestimonialsTranslations"("locale");

-- CreateIndex
CREATE INDEX "TestimonialsTranslations_documentId_idx" ON "TestimonialsTranslations"("documentId");

-- CreateIndex
CREATE INDEX "TestimonialsTranslations_slug_idx" ON "TestimonialsTranslations"("slug");

-- CreateIndex
CREATE INDEX "TestimonialsTranslations_title_idx" ON "TestimonialsTranslations"("title");

-- CreateIndex
CREATE INDEX "TestimonialsTranslations_nameSurname_idx" ON "TestimonialsTranslations"("nameSurname");

-- CreateIndex
CREATE UNIQUE INDEX "TestimonialsTranslations_documentId_locale_key" ON "TestimonialsTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Partners_documentId_key" ON "Partners"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Partners_imageId_key" ON "Partners"("imageId");

-- CreateIndex
CREATE INDEX "Partners_isDeleted_idx" ON "Partners"("isDeleted");

-- CreateIndex
CREATE INDEX "Partners_createdAt_idx" ON "Partners"("createdAt");

-- CreateIndex
CREATE INDEX "Partners_status_idx" ON "Partners"("status");

-- CreateIndex
CREATE INDEX "Partners_userId_idx" ON "Partners"("userId");

-- CreateIndex
CREATE INDEX "Partners_isDeleted_status_idx" ON "Partners"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "Partners_isDeleted_createdAt_idx" ON "Partners"("isDeleted", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PartnersTranslations_slug_key" ON "PartnersTranslations"("slug");

-- CreateIndex
CREATE INDEX "PartnersTranslations_title_idx" ON "PartnersTranslations"("title");

-- CreateIndex
CREATE INDEX "PartnersTranslations_locale_idx" ON "PartnersTranslations"("locale");

-- CreateIndex
CREATE INDEX "PartnersTranslations_documentId_idx" ON "PartnersTranslations"("documentId");

-- CreateIndex
CREATE INDEX "PartnersTranslations_slug_idx" ON "PartnersTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PartnersTranslations_documentId_locale_key" ON "PartnersTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Features_documentId_key" ON "Features"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Features_videoId_key" ON "Features"("videoId");

-- CreateIndex
CREATE INDEX "Features_isDeleted_idx" ON "Features"("isDeleted");

-- CreateIndex
CREATE INDEX "Features_status_idx" ON "Features"("status");

-- CreateIndex
CREATE INDEX "Features_createdAt_idx" ON "Features"("createdAt");

-- CreateIndex
CREATE INDEX "Features_userId_idx" ON "Features"("userId");

-- CreateIndex
CREATE INDEX "Features_isDeleted_status_idx" ON "Features"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "FeaturesTranslations_locale_idx" ON "FeaturesTranslations"("locale");

-- CreateIndex
CREATE INDEX "FeaturesTranslations_documentId_idx" ON "FeaturesTranslations"("documentId");

-- CreateIndex
CREATE INDEX "FeaturesTranslations_slug_idx" ON "FeaturesTranslations"("slug");

-- CreateIndex
CREATE INDEX "FeaturesTranslations_title_idx" ON "FeaturesTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturesTranslations_documentId_locale_key" ON "FeaturesTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Position_documentId_key" ON "Position"("documentId");

-- CreateIndex
CREATE INDEX "Position_isDeleted_idx" ON "Position"("isDeleted");

-- CreateIndex
CREATE INDEX "Position_createdAt_idx" ON "Position"("createdAt");

-- CreateIndex
CREATE INDEX "Position_status_idx" ON "Position"("status");

-- CreateIndex
CREATE INDEX "Position_userId_idx" ON "Position"("userId");

-- CreateIndex
CREATE INDEX "Position_orderNumber_idx" ON "Position"("orderNumber");

-- CreateIndex
CREATE INDEX "Position_isDeleted_status_idx" ON "Position"("isDeleted", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PositionTranslations_slug_key" ON "PositionTranslations"("slug");

-- CreateIndex
CREATE INDEX "PositionTranslations_title_idx" ON "PositionTranslations"("title");

-- CreateIndex
CREATE INDEX "PositionTranslations_locale_idx" ON "PositionTranslations"("locale");

-- CreateIndex
CREATE INDEX "PositionTranslations_documentId_idx" ON "PositionTranslations"("documentId");

-- CreateIndex
CREATE INDEX "PositionTranslations_slug_idx" ON "PositionTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PositionTranslations_documentId_locale_key" ON "PositionTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_documentId_key" ON "Employee"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_imageId_key" ON "Employee"("imageId");

-- CreateIndex
CREATE INDEX "Employee_isDeleted_idx" ON "Employee"("isDeleted");

-- CreateIndex
CREATE INDEX "Employee_createdAt_idx" ON "Employee"("createdAt");

-- CreateIndex
CREATE INDEX "Employee_status_idx" ON "Employee"("status");

-- CreateIndex
CREATE INDEX "Employee_userId_idx" ON "Employee"("userId");

-- CreateIndex
CREATE INDEX "Employee_orderNumber_idx" ON "Employee"("orderNumber");

-- CreateIndex
CREATE INDEX "Employee_email_idx" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_experience_idx" ON "Employee"("experience");

-- CreateIndex
CREATE INDEX "Employee_isDeleted_status_idx" ON "Employee"("isDeleted", "status");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeTranslations_slug_key" ON "EmployeeTranslations"("slug");

-- CreateIndex
CREATE INDEX "EmployeeTranslations_title_idx" ON "EmployeeTranslations"("title");

-- CreateIndex
CREATE INDEX "EmployeeTranslations_locale_idx" ON "EmployeeTranslations"("locale");

-- CreateIndex
CREATE INDEX "EmployeeTranslations_documentId_idx" ON "EmployeeTranslations"("documentId");

-- CreateIndex
CREATE INDEX "EmployeeTranslations_slug_idx" ON "EmployeeTranslations"("slug");

-- CreateIndex
CREATE INDEX "EmployeeTranslations_positionId_idx" ON "EmployeeTranslations"("positionId");

-- CreateIndex
CREATE INDEX "EmployeeTranslations_contactEnumTranslationsId_idx" ON "EmployeeTranslations"("contactEnumTranslationsId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeTranslations_documentId_locale_key" ON "EmployeeTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "About_documentId_key" ON "About"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "About_imageId_key" ON "About"("imageId");

-- CreateIndex
CREATE INDEX "About_isDeleted_idx" ON "About"("isDeleted");

-- CreateIndex
CREATE INDEX "About_status_idx" ON "About"("status");

-- CreateIndex
CREATE INDEX "About_createdAt_idx" ON "About"("createdAt");

-- CreateIndex
CREATE INDEX "About_userId_idx" ON "About"("userId");

-- CreateIndex
CREATE INDEX "About_isDeleted_status_idx" ON "About"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "AboutTranslations_locale_idx" ON "AboutTranslations"("locale");

-- CreateIndex
CREATE INDEX "AboutTranslations_documentId_idx" ON "AboutTranslations"("documentId");

-- CreateIndex
CREATE INDEX "AboutTranslations_slug_idx" ON "AboutTranslations"("slug");

-- CreateIndex
CREATE INDEX "AboutTranslations_title_idx" ON "AboutTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "AboutTranslations_documentId_locale_key" ON "AboutTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Services_documentId_key" ON "Services"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Services_imageId_key" ON "Services"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Services_iconsId_key" ON "Services"("iconsId");

-- CreateIndex
CREATE INDEX "Services_isDeleted_idx" ON "Services"("isDeleted");

-- CreateIndex
CREATE INDEX "Services_status_idx" ON "Services"("status");

-- CreateIndex
CREATE INDEX "Services_createdAt_idx" ON "Services"("createdAt");

-- CreateIndex
CREATE INDEX "Services_userId_idx" ON "Services"("userId");

-- CreateIndex
CREATE INDEX "Services_orderNumber_idx" ON "Services"("orderNumber");

-- CreateIndex
CREATE INDEX "Services_isDeleted_status_idx" ON "Services"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "Services_isDeleted_orderNumber_idx" ON "Services"("isDeleted", "orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ServicesTranslations_slug_key" ON "ServicesTranslations"("slug");

-- CreateIndex
CREATE INDEX "ServicesTranslations_locale_idx" ON "ServicesTranslations"("locale");

-- CreateIndex
CREATE INDEX "ServicesTranslations_documentId_idx" ON "ServicesTranslations"("documentId");

-- CreateIndex
CREATE INDEX "ServicesTranslations_slug_idx" ON "ServicesTranslations"("slug");

-- CreateIndex
CREATE INDEX "ServicesTranslations_title_idx" ON "ServicesTranslations"("title");

-- CreateIndex
CREATE INDEX "ServicesTranslations_seoId_idx" ON "ServicesTranslations"("seoId");

-- CreateIndex
CREATE UNIQUE INDEX "ServicesTranslations_documentId_locale_key" ON "ServicesTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "SectionCta_documentId_key" ON "SectionCta"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "SectionCta_key_key" ON "SectionCta"("key");

-- CreateIndex
CREATE INDEX "SectionCta_isDeleted_idx" ON "SectionCta"("isDeleted");

-- CreateIndex
CREATE INDEX "SectionCta_createdAt_idx" ON "SectionCta"("createdAt");

-- CreateIndex
CREATE INDEX "SectionCta_status_idx" ON "SectionCta"("status");

-- CreateIndex
CREATE INDEX "SectionCta_key_idx" ON "SectionCta"("key");

-- CreateIndex
CREATE INDEX "SectionCta_userId_idx" ON "SectionCta"("userId");

-- CreateIndex
CREATE INDEX "SectionCta_orderNumber_idx" ON "SectionCta"("orderNumber");

-- CreateIndex
CREATE INDEX "SectionCta_isDeleted_status_idx" ON "SectionCta"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "SectionCta_isDeleted_key_idx" ON "SectionCta"("isDeleted", "key");

-- CreateIndex
CREATE INDEX "SectionCtaTranslations_title_idx" ON "SectionCtaTranslations"("title");

-- CreateIndex
CREATE INDEX "SectionCtaTranslations_locale_idx" ON "SectionCtaTranslations"("locale");

-- CreateIndex
CREATE INDEX "SectionCtaTranslations_documentId_idx" ON "SectionCtaTranslations"("documentId");

-- CreateIndex
CREATE INDEX "SectionCtaTranslations_slug_idx" ON "SectionCtaTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SectionCtaTranslations_documentId_locale_key" ON "SectionCtaTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInformation_documentId_key" ON "ContactInformation"("documentId");

-- CreateIndex
CREATE INDEX "ContactInformation_isDeleted_idx" ON "ContactInformation"("isDeleted");

-- CreateIndex
CREATE INDEX "ContactInformation_createdAt_idx" ON "ContactInformation"("createdAt");

-- CreateIndex
CREATE INDEX "ContactInformation_phone_idx" ON "ContactInformation"("phone");

-- CreateIndex
CREATE INDEX "ContactInformation_email_idx" ON "ContactInformation"("email");

-- CreateIndex
CREATE INDEX "ContactInformation_userId_idx" ON "ContactInformation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInformationTranslation_documentId_key" ON "ContactInformationTranslation"("documentId");

-- CreateIndex
CREATE INDEX "ContactInformationTranslation_locale_idx" ON "ContactInformationTranslation"("locale");

-- CreateIndex
CREATE INDEX "ContactInformationTranslation_title_idx" ON "ContactInformationTranslation"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInformationTranslation_documentId_locale_key" ON "ContactInformationTranslation"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "PriceOffer_documentId_key" ON "PriceOffer"("documentId");

-- CreateIndex
CREATE INDEX "PriceOffer_isDeleted_idx" ON "PriceOffer"("isDeleted");

-- CreateIndex
CREATE INDEX "PriceOffer_status_idx" ON "PriceOffer"("status");

-- CreateIndex
CREATE INDEX "PriceOffer_createdAt_idx" ON "PriceOffer"("createdAt");

-- CreateIndex
CREATE INDEX "PriceOffer_email_idx" ON "PriceOffer"("email");

-- CreateIndex
CREATE INDEX "PriceOffer_phone_idx" ON "PriceOffer"("phone");

-- CreateIndex
CREATE INDEX "PriceOffer_assignedTo_idx" ON "PriceOffer"("assignedTo");

-- CreateIndex
CREATE UNIQUE INDEX "ContactUs_documentId_key" ON "ContactUs"("documentId");

-- CreateIndex
CREATE INDEX "ContactUs_isDeleted_idx" ON "ContactUs"("isDeleted");

-- CreateIndex
CREATE INDEX "ContactUs_status_idx" ON "ContactUs"("status");

-- CreateIndex
CREATE INDEX "ContactUs_createdAt_idx" ON "ContactUs"("createdAt");

-- CreateIndex
CREATE INDEX "ContactUs_email_idx" ON "ContactUs"("email");

-- CreateIndex
CREATE INDEX "ContactUs_phone_idx" ON "ContactUs"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ContactEnum_documentId_key" ON "ContactEnum"("documentId");

-- CreateIndex
CREATE INDEX "ContactEnum_isDeleted_idx" ON "ContactEnum"("isDeleted");

-- CreateIndex
CREATE INDEX "ContactEnum_createdAt_idx" ON "ContactEnum"("createdAt");

-- CreateIndex
CREATE INDEX "ContactEnum_status_idx" ON "ContactEnum"("status");

-- CreateIndex
CREATE INDEX "ContactEnum_userId_idx" ON "ContactEnum"("userId");

-- CreateIndex
CREATE INDEX "ContactEnum_orderNumber_idx" ON "ContactEnum"("orderNumber");

-- CreateIndex
CREATE INDEX "ContactEnum_isDeleted_status_idx" ON "ContactEnum"("isDeleted", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ContactEnumTranslations_slug_key" ON "ContactEnumTranslations"("slug");

-- CreateIndex
CREATE INDEX "ContactEnumTranslations_title_idx" ON "ContactEnumTranslations"("title");

-- CreateIndex
CREATE INDEX "ContactEnumTranslations_locale_idx" ON "ContactEnumTranslations"("locale");

-- CreateIndex
CREATE INDEX "ContactEnumTranslations_documentId_idx" ON "ContactEnumTranslations"("documentId");

-- CreateIndex
CREATE INDEX "ContactEnumTranslations_slug_idx" ON "ContactEnumTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContactEnumTranslations_documentId_locale_key" ON "ContactEnumTranslations"("documentId", "locale");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seo" ADD CONSTRAINT "Seo_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesTranslations" ADD CONSTRAINT "CategoriesTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Categories"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesTranslations" ADD CONSTRAINT "CategoriesTranslations_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "Seo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogTranslations" ADD CONSTRAINT "BlogTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Blog"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogTranslations" ADD CONSTRAINT "BlogTranslations_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "Seo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogView" ADD CONSTRAINT "BlogView_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionContent" ADD CONSTRAINT "SectionContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionContentTranslations" ADD CONSTRAINT "SectionContentTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "SectionContent"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqTranslations" ADD CONSTRAINT "FaqTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Faq"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advantages" ADD CONSTRAINT "Advantages_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advantages" ADD CONSTRAINT "Advantages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvantagesTranslations" ADD CONSTRAINT "AdvantagesTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Advantages"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkProcess" ADD CONSTRAINT "WorkProcess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkProcessTranslations" ADD CONSTRAINT "WorkProcessTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "WorkProcess"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statistics" ADD CONSTRAINT "Statistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatisticsTranslations" ADD CONSTRAINT "StatisticsTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Statistics"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slider" ADD CONSTRAINT "Slider_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slider" ADD CONSTRAINT "Slider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SliderTranslations" ADD CONSTRAINT "SliderTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Slider"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchTranslation" ADD CONSTRAINT "BranchTranslation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Branch"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeTranslation" ADD CONSTRAINT "OfficeTranslation_officeDocumentId_fkey" FOREIGN KEY ("officeDocumentId") REFERENCES "Office"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroTranslations" ADD CONSTRAINT "HeroTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Hero"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Youtube" ADD CONSTRAINT "Youtube_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Youtube" ADD CONSTRAINT "Youtube_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YoutubeTranslations" ADD CONSTRAINT "YoutubeTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Youtube"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificatesTranslations" ADD CONSTRAINT "CertificatesTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Certificates"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonials" ADD CONSTRAINT "Testimonials_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonials" ADD CONSTRAINT "Testimonials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialsTranslations" ADD CONSTRAINT "TestimonialsTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Testimonials"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partners" ADD CONSTRAINT "Partners_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partners" ADD CONSTRAINT "Partners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnersTranslations" ADD CONSTRAINT "PartnersTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Partners"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturesTranslations" ADD CONSTRAINT "FeaturesTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Features"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionTranslations" ADD CONSTRAINT "PositionTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Position"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTranslations" ADD CONSTRAINT "EmployeeTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Employee"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTranslations" ADD CONSTRAINT "EmployeeTranslations_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "PositionTranslations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTranslations" ADD CONSTRAINT "EmployeeTranslations_contactEnumTranslationsId_fkey" FOREIGN KEY ("contactEnumTranslationsId") REFERENCES "ContactEnumTranslations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "About" ADD CONSTRAINT "About_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "About" ADD CONSTRAINT "About_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutTranslations" ADD CONSTRAINT "AboutTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "About"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_iconsId_fkey" FOREIGN KEY ("iconsId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesTranslations" ADD CONSTRAINT "ServicesTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Services"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesTranslations" ADD CONSTRAINT "ServicesTranslations_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "Seo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionCta" ADD CONSTRAINT "SectionCta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionCtaTranslations" ADD CONSTRAINT "SectionCtaTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "SectionCta"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInformation" ADD CONSTRAINT "ContactInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInformationTranslation" ADD CONSTRAINT "ContactInformationTranslation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ContactInformation"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactEnum" ADD CONSTRAINT "ContactEnum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactEnumTranslations" ADD CONSTRAINT "ContactEnumTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ContactEnum"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;
