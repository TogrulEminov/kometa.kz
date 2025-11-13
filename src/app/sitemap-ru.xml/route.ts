import { getDynamicItemsForLocale } from "@/src/actions/ui/get-slug.actions";
import { Locales } from "@/src/generated/prisma";
import { Pathnames, routing } from "@/src/i18n/routing";
import { NextResponse } from "next/server";
function buildUrl(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .join("/")
    .replace(/([^:]\/)\/+/g, "$1")
    .replace(/\/+$/, "");
}

function getTranslatedPath(
  canonicalPath: keyof Pathnames,
  locale: string
): string {
  const pathConfig = routing.pathnames[canonicalPath];
  if (pathConfig && typeof pathConfig === "object") {
    const translated = (pathConfig as any)[locale];
    return translated === "/" ? "" : translated;
  }
  return canonicalPath;
}

function addUniqueUrl(
  uniqueUrls: Set<string>,
  loc: string,
  lastmod: string,
  changefreq: "monthly" | "weekly",
  priority: number
): string {
  const normalizedLoc =
    loc.length > 1 && loc.endsWith("/") ? loc.slice(0, -1) : loc;

  if (uniqueUrls.has(normalizedLoc)) {
    return "";
  }

  uniqueUrls.add(normalizedLoc);

  return `  <url>
    <loc>${normalizedLoc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const localeParam = "ru";
  const locale = localeParam.replace(".xml", "") as Locales;

  if (!routing.locales.includes(locale as any)) {
    console.error("Invalid locale:", locale);
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const websiteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mlgroup.az";
    const now = new Date().toISOString();

    const uniqueUrls = new Set<string>();
    const sitemapParts: string[] = [];

    // ══════════════════════════════════════════════════════
    // 1. Statik Səhifələr
    // ══════════════════════════════════════════════════════
    const staticPages: (keyof Pathnames)[] = [
      "/about",
      "/services",
      "/blog",
      "/partner",
      "/certificates",
      "/contact",
    ];

    staticPages.forEach((page) => {
      const translatedPath = getTranslatedPath(page, locale);
      const locPath = buildUrl(websiteUrl, translatedPath);
      sitemapParts.push(addUniqueUrl(uniqueUrls, locPath, now, "monthly", 0.8));
    });

    const dynamicPageConfigs = [
      {
        model: "blog" as const,
        path: getTranslatedPath("/blog", locale),
      },
      {
        model: "services" as const,
        path: getTranslatedPath("/services", locale),
      },
    ];

    for (const config of dynamicPageConfigs) {
      const items = await getDynamicItemsForLocale(config.model, locale);
      for (const item of items) {
        if (item.slug) {
          const loc = buildUrl(websiteUrl, config.path, item.slug);
          const lastmod = new Date(
            item.updatedAt || item.createdAt
          ).toISOString();
          sitemapParts.push(
            addUniqueUrl(uniqueUrls, loc, lastmod, "weekly", 0.7)
          );
        }
      }
    }

    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapParts.filter(Boolean).join("\n")}
</urlset>`;

    return new Response(sitemapXML, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error(`SITEMAP GENERATION FAILED for locale: ${locale}`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
