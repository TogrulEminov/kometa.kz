import { Locales } from "@/src/generated/prisma";
import { db } from "@/src/lib/admin/prismaClient";
import { unstable_cache } from "next/cache";

type GetProps = {
  locale: Locales;
  slug: string;
};

// Optimized query with caching
export const getServicesSlugServer = unstable_cache(
  async ({ locale, slug }: GetProps) => {
    // Single Promise.all - 20 queries yerine 1 batch request
    const [mainData, mainCollection, contactData] = await Promise.all([
      await db.services.findFirst({
        where: {
          isDeleted: false,
          translations: {
            some: {
              locale: locale,
              slug: slug,
            },
          },
        },
        include: {
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
          translations: {
            where: { locale },
            include: {
              seo: true,
            },
          },
        },
      }),
      await db.services.findMany({
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
      }),
      await db.contactInformation.findFirst({
        include: {
          translations: {
            where: { locale },
          },
        },
      }),
    ]);
    return {
      data: {
        mainData,
        mainCollection,
        contactData,
      },
    };
  },
  ["services-slug"], // Cache key
  {
    revalidate: 60, // 60 saniyə cache - istəyə görə dəyişdirə bilərsiniz
    tags: ["services-slug", "services-slug-data"],
  }
);
