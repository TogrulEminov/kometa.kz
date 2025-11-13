import { Locales, Prisma } from "@/src/generated/prisma";
import { db } from "@/src/lib/admin/prismaClient";
import { unstable_cache } from "next/cache";

type GetProps = {
  page: number;
  pageSize: number;
  locale: Locales;
  sort?: string;
};

// Optimized query with caching
export const getGalleryServer = unstable_cache(
  async ({ page, pageSize, locale, sort }: GetProps) => {
    const customPageSize = Number(pageSize) || Number(12);
    const skip = 0;
    const take = Number(page) * customPageSize;
    const whereClause: Prisma.PhotoGalleryWhereInput = {
      isDeleted: false,
      translations: {
        some: {
          locale: locale,
        },
      },
    };
    const [mainData, countData, categoriesData, socialData, ctaData] =
      await Promise.all([
        await db.photoGallery.findMany({
          where: whereClause,
          select: {
            status: true,
            documentId: true,
            id: true,
            imageUrl: true,
            gallery: true,
            createdAt: true,
            updatedAt: true,
            translations: {
              where: {
                locale: locale,
              },
              select: {
                slug: true,
                id: true,
                locale: true,
                title: true,
                description: true,
                documentId: true,
              },
            },
          },
          orderBy: { createdAt: (sort as Prisma.SortOrder) ?? "desc" },
          skip: skip,
          take: take,
        }),
        await db.photoGallery.count({ where: whereClause }),
        await db.categories.findFirst({
          where: {
            isDeleted: false,
            slug: "gallery",
            translations: {
              some: { locale },
            },
          },
          include: {
            imageUrl: {
              select: {
                id: true,
                publicUrl: true,
                fileKey: true,
              },
            },
            translations: {
              where: { locale },
              include: {
                seo: {
                  include: {
                    imageUrl: {
                      select: {
                        id: true,
                        publicUrl: true,
                        fileKey: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        await db.social.findUnique({
          where: {
            socialName: "contact",
          },
        }),
        await db.sectionCta.findFirst({
          where: {
            isDeleted: false,
            key: "gallery",
            translations: { some: { locale } },
          },
          select: {
            id: true,
            key: true,
            documentId: true,
            translations: {
              where: { locale },
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
          },
        }),
      ]);
    const totalPages = Math.ceil(countData / customPageSize);
    return {
      data: {
        mainData,
        categoriesData,
        socialData,
      },
      sections: {
        ctaData,
      },
      paginations: {
        page,
        pageSize: customPageSize,
        totalPages: totalPages,
        dataCount: countData,
      },
    };
  },
  ["gallery-main"], // Cache key
  {
    revalidate: 60, // 60 saniyə cache - istəyə görə dəyişdirə bilərsiniz
    tags: ["gallery-main", "gallery-main-data"],
  }
);
