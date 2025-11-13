import { Locales } from "@/src/generated/prisma";
import { db } from "@/src/lib/admin/prismaClient";
import { unstable_cache } from "next/cache";

type GetProps = {
  locale: Locales;
};

// Optimized query with caching
export const getContactServer = unstable_cache(
  async ({ locale }: GetProps) => {
    const [mainData, categoriesData, branchesData] = await Promise.all([
      await db.contactInformation.findFirst({
        include: {
          translations: {
            where: { locale },
          },
        },
      }),

      await db.categories.findFirst({
        where: {
          isDeleted: false,
          slug: "contact",
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
      db.branch.findMany({
        where: {
          isDeleted: false,
          translations: { some: { locale } },
        },
        select: {
          status: true,
          documentId: true,
          id: true,
          isoCode: true,
          translations: {
            where: { locale },
            select: {
              id: true,
              countryName: true,
            },
          },
          offices: {
            where: { isDeleted: false },
            select: {
              id: true,
              type: true,
              latitude: true,
              longitude: true,
              documentId: true,
              translations: {
                where: { locale },
                select: {
                  city: true,
                  address: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      data: {
        mainData,
        categoriesData,
        branchesData,
      },
    };
  },
  ["contact"], // Cache key
  {
    revalidate: 60, // 60 saniyə cache - istəyə görə dəyişdirə bilərsiniz
    tags: ["contact", "contact-data"],
  }
);
