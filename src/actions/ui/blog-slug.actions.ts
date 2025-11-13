import { Locales } from "@/src/generated/prisma";
import { db } from "@/src/lib/admin/prismaClient";
import { unstable_cache } from "next/cache";
import { getBlogNavigation } from "../client/blog.actions";

type GetProps = {
  locale: Locales;
  slug: string;
};

// Optimized query with caching
export const getBlogSlugServer = unstable_cache(
  async ({ locale, slug }: GetProps) => {
    // Single Promise.all - 20 queries yerine 1 batch request
    const [mainData, previousNextData] = await Promise.all([
      await db.blog.findFirst({
        where: {
          isDeleted: false,
          translations: {
            some: {
              locale: locale,
              slug: slug,
            },
          },
        },
        select: {
          id: true,
          documentId: true,
          status: true,
          view: true,
          imageUrl: {
            select: {
              id: true,
              publicUrl: true,
              fileKey: true,
            },
          },
          translations: {
            where: { locale },
            select: {
              id: true,
              title: true,
              description: true,
              slug: true,
              readTime: true,
              tags: true,
              locale: true,
              seo: {
                select: {
                  metaTitle: true,
                  metaDescription: true,
                  metaKeywords: true,
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
      await getBlogNavigation({
        id: slug,
        locale: locale,
      }),
    ]);
    return {
      data: {
        mainData,
        previousNextData,
      },
    };
  },
  ["blog-slug"], // Cache key
  {
    revalidate: 60, // 60 saniyə cache - istəyə görə dəyişdirə bilərsiniz
    tags: ["blog-slug", "blog-slug-data"],
  }
);
