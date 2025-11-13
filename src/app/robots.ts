import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // 1. BASE_URL təyinatı (Çox vacib)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mlgroup.az";

  return {
    // 2. Botların Bütün Qaydaları
    rules: [
      {
        // 2a. Ümumi Botlar (Crawler-lərin əksəriyyəti)
        userAgent: "*",
        allow: "/",
        disallow: [
          // İdarəetmə və autentifikasiya səhifələrini tamamilə blokla
          "/manage",
          "/manage/*",
          "/auth/*",

          // API endpoint-lərini blokla
          "/api/*",

          // Sorğu parametrlərini (query parameters) blokla
          "/*?*",
          "/*&*",

          // Next.js-in daxili səhifələrini və statik resursları blokla
          "/_next/*",
          "/static/*",

          // Müvəqqəti və ya lazımsız fayl qovluqlarını blokla
          "/temp/*",
          "/uploads/temp/*",

          // Daha xüsusi sorğu parametrlərini blokla
          "/*?page=*",
          "/*?sort=*",
          "/*?filter=*",
          "/*?search=*",
          "/*?q=*",
          "/*?utm_*",

          // Çox böyük səhifə nömrələrini blokla
          "/*page=10*",
          "/*page=[2-9][0-9]*",

          // Çap səhifələrini blokla
          "/*/print",
          "/print/*",
        ],
      },
      {
        // 2b. Googlebot üçün Xüsusi Qaydalar
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/manage", "/manage/*", "/auth/*", "/api/*", "/*?*"],
      },
      {
        // 2c. Google Şəkil Botu
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/manage", "/auth/*"],
      },
      {
        // 2d. Bingbot üçün Xüsusi Qaydalar
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/manage", "/manage/*", "/auth/*", "/api/*", "/*?*"],
      },
      {
        // 2e. Zərərli və ya Lazımsız Botlar
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "DotBot",
          "MJ12bot",
          "BLEXBot",
          "DataForSeoBot",
          "PetalBot",
          "MegaIndex",
          "Cliqzbot",
        ],
        disallow: "/",
      },
    ],

    // 3. Sitemap Təyinatı
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-az.xml`,
      `${baseUrl}/sitemap-en.xml`,
      `${baseUrl}/sitemap-ru.xml`,
    ],
  };
}
