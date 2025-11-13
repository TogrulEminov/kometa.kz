import { Locales } from "@/src/generated/prisma";
import { db } from "@/src/lib/admin/prismaClient";
import { unstable_cache } from "next/cache";

type GetProps = {
  locale: Locales;
};

// ✅ Optimized query with caching
export const getHome = unstable_cache(
  async ({ locale }: GetProps) => {
    const [
      heroData,
      featuresData,
      advantagesData,
      serviceData,
      workProcessData,
      branchesData,
      mediaData,
      blogData,
      reviewsData,
      // partnersData,
      fagsData,
      contactInfo,
      // ✅ Sections-u birləşdirdik - 8 query əvəzinə 1
      sections,
    ] = await Promise.all([
      // Hero
      db.hero.findFirst({
        where: { isDeleted: false },
        select: {
          imageUrl: {
            select: {
              id: true,
              fileKey: true,
              publicUrl: true,
              mimeType: true,
            },
          },
          translations: {
            where: { locale },
            select: {
              title: true,
              description: true,
              badge: true,
              subtitle: true,
              highlightWord: true,
              primaryButton: true,
              secondaryButton: true,
              features: true,
              statistics: true,
              slug: true,
            },
          },
        },
      }),

      // Features
      db.features.findFirst({
        where: { isDeleted: false },
        select: {
          videoUrl: {
            select: {
              id: true,
              publicUrl: true,
              mimeType: true,
            },
          },
          translations: {
            where: { locale },
            select: {
              title: true,
              slug: true,
              description: true,
              subtitle: true,
            },
          },
        },
      }),

      // Advantages
      db.advantages.findMany({
        where: {
          isDeleted: false,
          translations: { some: { locale } },
        },
        select: {
          imageUrl: {
            select: {
              id: true,
              publicUrl: true,
            },
          },
          translations: {
            where: { locale },
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
            },
          },
        },
      }),

      // Services
      db.services.findMany({
        where: {
          isDeleted: false,
          translations: { some: { locale } },
        },
        select: {
          documentId: true,
          iconsUrl: {
            select: {
              id: true,
              publicUrl: true,
            },
          },
          imageUrl: {
            select: {
              id: true,
              publicUrl: true,
            },
          },
          translations: {
            where: { locale },
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
            },
          },
        },
        orderBy: { orderNumber: "asc" },
        take: 12,
      }),

      // Work Process
      db.workProcess.findMany({
        where: {
          isDeleted: false,
          translations: { some: { locale } },
        },
        select: {
          documentId: true,
          id: true,
          orderNumber: true,
          translations: {
            where: { locale },
            select: {
              id: true,
              description: true,
              title: true,
            },
          },
        },
        orderBy: { orderNumber: "asc" },
        take: 12,
      }),

      // Branches
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
              latitude: true,
              longitude: true,
              documentId: true,
              type: true,
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

      // Media/YouTube
      db.youtube.findMany({
        where: {
          isDeleted: false,
          translations: { some: { locale } },
        },
        select: {
          documentId: true,
          id: true,
          imageUrl: true,
          url: true,
          translations: {
            where: { locale },
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),

      // Blog
      db.blog.findMany({
        where: {
          isDeleted: false,
          translations: { some: { locale } },
        },
        select: {
          status: true,
          documentId: true,
          id: true,
          view: true,
          imageUrl: {
            select: {
              id: true,
              publicUrl: true,
            },
          },
          createdAt: true,
          translations: {
            where: { locale },
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              readTime: true,
              tags: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),

      // Testimonials
      db.testimonials.findMany({
        where: {
          isDeleted: false,
          translations: { some: { locale } },
        },
        select: {
          status: true,
          documentId: true,
          id: true,
          rate: true,
          company: true,
          imageUrl: {
            select: {
              id: true,
              publicUrl: true,
            },
          },
          translations: {
            where: { locale },
            select: {
              id: true,
              slug: true,
              nameSurname: true,
              description: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      // Partners
      // db.partners.findMany({
      //   where: { isDeleted: false },
      //   select: {
      //     status: true,
      //     documentId: true,
      //     url: true,
      //     id: true,
      //     imageUrl: {
      //       select: {
      //         id: true,
      //         publicUrl: true,
      //       },
      //     },
      //     translations: {
      //       where: { locale },
      //       select: {
      //         id: true,
      //         slug: true,
      //         title: true,
      //       },
      //     },
      //   },
      //   orderBy: { createdAt: "desc" },
      //   take: 8,
      // }),

      // FAQ
      db.faq.findMany({
        where: {
          isDeleted: false,
          translations: { some: { locale } },
        },
        select: {
          status: true,
          documentId: true,
          id: true,
          translations: {
            where: { locale },
            select: {
              id: true,
              slug: true,
              description: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),

      // Contact Info
      db.contactInformation.findFirst({
        select: {
          id: true,
          documentId: true,
          createdAt: true,
          updatedAt: true,
          translations: {
            where: { locale },
            select: {
              id: true,
              adress: true,
              title: true,
              description: true,
            },
          },
          phone: true,
          whatsapp: true,
          email: true,
        },
      }),

      // ✅ Section Contents - BİRLƏŞDİRİLMİŞ (8 query əvəzinə 1)
      db.sectionContent.findMany({
        where: {
          isDeleted: false,
          key: {
            in: [
              "services",
              "process",
              "testimonials",
              "fag",
              "media",
              "blog",
              "branches",
              // "partners",
            ],
          },
          translations: { some: { locale } },
        },
        select: {
          key: true,
          id: true,
          documentId: true,
          translations: {
            where: { locale },
            select: {
              id: true,
              title: true,
              slug: true,
              subTitle: true,
              description: true,
            },
          },
        },
      }),
    ]);

    // ✅ Sections-u organize edin
    const sectionsMap = sections.reduce((acc, section) => {
      acc[`${section.key}Section`] = section;
      return acc;
    }, {} as Record<string, any>);

    // ✅ Contact CTA ayrıca (əgər fərqli strukturdursa)
    const contactCta = await db.sectionCta.findFirst({
      where: {
        isDeleted: false,
        key: "contact",
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
    });

    return {
      data: {
        heroData,
        featuresData,
        advantagesData,
        serviceData,
        workProcessData,
        branchesData,
        mediaData,
        blogData,
        reviewsData,
        // partnersData,
        fagsData,
        contactInfo,
      },
      sections: {
        servicesSection: sectionsMap.servicesSection,
        processSection: sectionsMap.processSection,
        testimonialsSection: sectionsMap.testimonialsSection,
        fagSection: sectionsMap.fagSection,
        mediaSection: sectionsMap.mediaSection,
        blogSection: sectionsMap.blogSection,
        branchesSection: sectionsMap.branchesSection,
        partnersSection: sectionsMap.partnersSection,
        contactCta,
      },
    };
  },
  ["home"], // Cache key
  {
    revalidate: 60 * 5, // ✅ 1 saat cache (60 saniyə çox tez-tez idi)
    tags: ["home", "homepage-data"],
  }
);
