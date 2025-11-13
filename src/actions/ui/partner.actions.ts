import { Locales } from "@/src/generated/prisma";
import { db } from "@/src/lib/admin/prismaClient";
import { unstable_cache } from "next/cache";

type GetProps = {
  locale: Locales;
};

// Optimized query with caching
export const getPartnerServer = unstable_cache(
  async ({ locale }: GetProps) => {
    const [mainData, categoriesData, ctaData] = await Promise.all([
      db.partners.findMany({
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
          url: true,
          id: true,
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
            where: {
              locale: locale,
            },
            select: {
              slug: true,
              id: true,
              locale: true,
              title: true,
              documentId: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      await db.categories.findFirst({
        where: {
          isDeleted: false,
          slug: "partner",
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
          key: "partner",
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
    return {
      data: {
        mainData,
        categoriesData,
      },
      sections: {
        ctaData,
      },
    };
  },
  ["partner"], // Cache key
  {
    revalidate: 60, // 60 saniyə cache - istəyə görə dəyişdirə bilərsiniz
    tags: ["partner", "partner-data"],
  }
);
