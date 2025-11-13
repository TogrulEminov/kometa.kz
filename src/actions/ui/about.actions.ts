import { Locales } from "@/src/generated/prisma";
import { db } from "@/src/lib/admin/prismaClient";
import { unstable_cache } from "next/cache";

type GetProps = {
  locale: Locales;
};

// Optimized query with caching
export const getAboutServer = unstable_cache(
  async ({ locale }: GetProps) => {
    // Single Promise.all - 20 queries yerine 1 batch request
    const [
      aboutData,
      employeeData,
      categoriesData,
      contactCta,
      contactInfo,
      employeeSection,
    ] = await Promise.all([
      await db.about.findFirst({
        include: {
          imageUrl: {
            select: {
              id: true,
              fileKey: true,
              originalName: true,
              mimeType: true,
              publicUrl: true,
              fileSize: true,
            },
          },
          translations: {
            where: { locale },
          },
        },
      }),
      db.employee.findMany({
        where: {
          isDeleted: false,
          translations: {
            some: { locale },
          },
        },
        select: {
          status: true,
          documentId: true,
          email: true,
          experience: true,
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
              id: true,
              slug: true,
              locale: true,
              position: true,
              title: true,
              documentId: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      await db.categories.findFirst({
        where: {
          isDeleted: false,
          slug: "about",
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
          key: "about",
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

      // Section contents - combined with shared where clause
      db.sectionContent.findFirst({
        where: {
          isDeleted: false,
          key: "employee",
          translations: { some: { locale } },
        },
        select: {
          key: true,
          id: true,
          documentId: true,
          translations: { where: { locale } },
        },
      }),
    ]);

    return {
      data: {
        aboutData,
        employeeData,
        categoriesData,
        contactInfo,
      },
      sections: {
        contactCta,
        employeeSection,
      },
    };
  },
  ["about"], // Cache key
  {
    revalidate: 60, // 60 saniyə cache - istəyə görə dəyişdirə bilərsiniz
    tags: ["about", "about-data"],
  }
);
