// app/rss.xml/route.ts

import { db } from "@/src/lib/admin/prismaClient";
import { NextResponse } from "next/server";
import { routing } from "@/src/i18n/routing";
import { stripHtmlTags } from "@/src/lib/domburify";
import { TIMEOUTS, withDatabaseTimeout } from "@/src/utils/timeout-utils";

// ✅ Route configuration
export const runtime = "nodejs"; // Prisma üçün
export const dynamic = "force-dynamic"; // Cache-siz
export const revalidate = 3600; // 1 saat cache (optional)

/**
 * ✅ Fetch posts with timeout
 */
async function fetchPostsForLocale(locale: string, pageConfigs: any[]) {
  const postsPromises = pageConfigs.map(async (config) => {
    try {
      return await withDatabaseTimeout(async () => {
        const modelDelegate = db[config.model as keyof typeof db];

        if (!modelDelegate) {
          console.warn(
            `⚠️  Model ${config.model} not found on Prisma Client. Skipping.`
          );
          return [];
        }

        const selectClause: any = {
          createdAt: true,
          translations: {
            where: { locale: locale },
            select: {
              title: true,
              description: true,
              slug: true,
              locale: true,
            },
          },
        };

        // Additional fields for specific models
        if (config.model === "projects") {
          selectClause.category = {
            select: {
              translations: {
                where: { locale: locale },
                select: { slug: true },
              },
            },
          };
        } else if (config.model === "interior") {
          selectClause.styles = {
            select: {
              translations: {
                where: { locale: locale },
                select: { slug: true },
              },
            },
          };
        }

        const data = await (modelDelegate as any).findMany({
          select: selectClause,
          orderBy: {
            createdAt: "desc",
          },
          take: 100, // ✅ Limit results (performance)
        });

        return data
          .map((item: any) => {
            const translation = item.translations[0];
            if (!translation || !translation.slug) {
              return null;
            }

            const postData: any = {
              ...translation,
              createdAt: item.createdAt,
              typePath: config.path,
            };

            if (config.model === "projects") {
              postData.categorySlug = item.category?.translations?.[0]?.slug;
            } else if (config.model === "interior") {
              postData.styleSlug = item.styles?.translations?.[0]?.slug;
            }

            return postData;
          })
          .filter(Boolean);
      }, TIMEOUTS.DATABASE_QUERY); // ✅ Database timeout
    } catch (error) {
      console.error(
        `❌ Error fetching ${config.model} for locale ${locale}:`,
        error
      );
      return [];
    }
  });

  const postsForLocale = await Promise.all(postsPromises);
  return postsForLocale.flat();
}

/**
 * ✅ Generate RSS item
 */
function generateRSSItem(post: any, websiteUrl: string, postLocale: string) {
  try {
    const canonicalPath = `/${post.typePath}` as keyof typeof routing.pathnames;
    const localizedPathSegment =
      routing.pathnames[canonicalPath]?.[
        postLocale as (typeof routing.locales)[number]
      ] ?? `/${post.typePath}`;

    let itemUrl = `${websiteUrl}/${postLocale}${localizedPathSegment}/${post.slug}`;

    // Special URL handling for projects and interior
    if (post.typePath === "projects" && post.categorySlug) {
      itemUrl = `${websiteUrl}/${
        postLocale === "az" ? "" : postLocale
      }${localizedPathSegment}/${post.categorySlug}/${post.slug}`;
    } else if (post.typePath === "interior" && post.styleSlug) {
      itemUrl = `${websiteUrl}/${
        postLocale === "az" ? "" : postLocale
      }${localizedPathSegment}/${post.styleSlug}/${post.slug}`;
    }

    // ✅ Sanitize content for XML
    const title = (post.title || "").replace(/[<>&"']/g, (char) => {
      const entities: any = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      };
      return entities[char];
    });

    const description = stripHtmlTags(post.description || "");

    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${itemUrl}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${itemUrl}</guid>
    </item>`;
  } catch (error) {
    console.error("❌ Error generating RSS item:", error);
    return "";
  }
}

/**
 * ✅ Main GET handler
 */
export async function GET() {
  try {
    const locales = ["az", "en", "ru"];
    const pageConfigs = [
      { model: "blog", path: "blog" },
      { model: "services", path: "services" },
    ];

    // ✅ Fetch all posts with timeout
    const allPostsPromises = locales.map((locale) =>
      fetchPostsForLocale(locale, pageConfigs)
    );

    const postsWithPaths = await Promise.all(allPostsPromises);

    const allPosts = postsWithPaths
      .flat()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 1000); // ✅ Limit total items

    // ✅ Generate RSS XML
    const websiteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mlgroup.az";
    const defaultLocale = routing.defaultLocale;

    const rssItems = allPosts
      .map((post: any) => generateRSSItem(post, websiteUrl, post.locale))
      .filter(Boolean)
      .join("");

    const rssXML = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Profi Transport</title>
    <link>${websiteUrl}</link>
    <description>Profi Transport - ən son dəyişikliklərimiz</description>
    <language>${defaultLocale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${websiteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rssXML, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // 1 saat cache
      },
    });
  } catch (error) {
    console.error("❌ RSS Generation Error:", error);

    // ✅ Return minimal valid RSS on error
    const fallbackRSS = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Profi Transport</title>
    <link>${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}</link>
    <description>RSS temporarily unavailable</description>
  </channel>
</rss>`;

    return new NextResponse(fallbackRSS, {
      status: 500,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}
