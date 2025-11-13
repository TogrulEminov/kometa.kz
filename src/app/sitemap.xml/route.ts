import { routing } from "@/src/i18n/routing";

export async function GET() {
  const websiteUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const now = new Date().toISOString();

  const sitemaps = routing.locales.map((locale) => {
    return `
  <sitemap>
    <loc>${websiteUrl}sitemap-${locale}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
  });

  const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.join("")}
</sitemapindex>`;

  return new Response(sitemapIndexXML, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
