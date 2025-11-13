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
export const getServicesServer = unstable_cache(
  async ({ page, pageSize, locale }: GetProps) => {
    const customPageSize = Number(pageSize) || Number(12);
    const skip = 0;
    const take = Number(page) * customPageSize;
    const whereClause: Prisma.ServicesWhereInput = {
      isDeleted: false,
      translations: {
        some: {
          locale: locale,
        },
      },
    };
    // Single Promise.all - 20 queries yerine 1 batch request
    const [mainData, totalCount, categoriesData, ctaData] = await Promise.all([
      await db.services.findMany({
        where: whereClause,
        select: {
          status: true,
          documentId: true,
          id: true,
          iconsUrl: {
            select: {
              id: true,
              publicUrl: true,
              fileKey: true,
            },
          },
          imageUrl: {
            select: {
              id: true,
              publicUrl: true,
              fileKey: true,
            },
          },

          createdAt: true,
          updatedAt: true,
          translations: {
            where: { locale: locale },
            select: {
              id: true,
              locale: true,
              slug: true,
              title: true,
              description: true,
              shortDescription: true,
              documentId: true,
            },
          },
        },
        orderBy: { orderNumber: "asc" },
        skip: skip,
        take: take,
      }),
      await db.services.count({ where: whereClause }),
      await db.categories.findFirst({
        where: {
          isDeleted: false,
          slug: "services",
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
      await db.sectionCta.findFirst({
        where: {
          isDeleted: false,
          key: "services",
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
    const totalPages = Math.ceil(totalCount / customPageSize);
    return {
      data: {
        mainData,
        categoriesData,
      },
      sections: {
        ctaData,
      },
      paginations: {
        page,
        pageSize: customPageSize,
        totalPages: totalPages,
        dataCount: totalCount,
      },
    };
  },
  ["services"], // Cache key
  {
    revalidate: 60, // 60 saniyə cache - istəyə görə dəyişdirə bilərsiniz
    tags: ["services", "services-data"],
  }
);
