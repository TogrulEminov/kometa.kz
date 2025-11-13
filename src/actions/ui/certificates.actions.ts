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
export const getCertificatesServer = unstable_cache(
  async ({ page, pageSize, locale, sort }: GetProps) => {
    const customPageSize = Number(pageSize) || Number(12);
    const skip = 0;
    const take = Number(page) * customPageSize;
    // Single Promise.all - 20 queries yerine 1 batch request
    const [mainData, categoriesData, contactCta, contactInfo, totalCount] =
      await Promise.all([
        db.certificates.findMany({
          where: {
            isDeleted: false,
            translations: {
              some: {
                locale,
              },
            },
          },
          select: {
            status: true,
            documentId: true,
            id: true,
            imageUrl: true,
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

        await db.categories.findFirst({
          where: {
            isDeleted: false,
            slug: "certificates",
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
        db.sectionCta.findFirst({
          where: {
            isDeleted: false,
            key: "contact",
            translations: { some: { locale } },
          },
          select: {
            translations: { where: { locale } },
          },
        }),
        await db.contactInformation.findFirst({
          include: {
            translations: {
              where: { locale },
            },
          },
        }),
        db.certificates.count({
          where: {
            isDeleted: false,
            translations: {
              some: {
                locale,
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
        contactInfo,
      },
      sections: {
        contactCta,
      },
      paginations: {
        page,
        pageSize: customPageSize,
        totalPages: totalPages,
        dataCount: totalCount,
      },
    };
  },
  ["certificates"], // Cache key
  {
    revalidate: 60, // 60 saniyə cache - istəyə görə dəyişdirə bilərsiniz
    tags: ["certificates", "certificates-data"],
  }
);
