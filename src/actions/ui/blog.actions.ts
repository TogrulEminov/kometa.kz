import { Locales, Prisma } from "@/src/generated/prisma";
import { db } from "@/src/lib/admin/prismaClient";
import { unstable_cache } from "next/cache";

type GetProps = {
  page: number;
  query?: string;
  pageSize: number;
  locale: Locales;
  sort?: string;
};

// Optimized query with caching
export const getBlogServer = unstable_cache(
  async ({ page, pageSize, locale, sort }: GetProps) => {
    const customPageSize = Number(pageSize) || Number(12);
    const skip = 0;
    const take = Number(page) * customPageSize;
    const whereClause: Prisma.BlogWhereInput = {
      isDeleted: false,
      translations: {
        some: {
          locale: locale,
        },
      },
    };
    // Single Promise.all - 20 queries yerine 1 batch request
    const [mainData, totalCount, categoriesData, ctaData] = await Promise.all([
      await db.blog.findMany({
        where: whereClause,
        select: {
          status: true,
          documentId: true,
          id: true,
          view: true,
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
              readTime: true,
              tags: true,
              documentId: true,
            },
          },
        },
        orderBy: { createdAt: (sort as Prisma.SortOrder) ?? "desc" },
        skip: skip,
        take: take,
      }),
      await db.blog.count({ where: whereClause }),
      await db.categories.findFirst({
        where: {
          isDeleted: false,
          slug: "blog",
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
          key: "blog",
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
  ["blog"], // Cache key
  {
    revalidate: 60, // 60 saniyə cache - istəyə görə dəyişdirə bilərsiniz
    tags: ["blog", "blog-data"],
  }
);
