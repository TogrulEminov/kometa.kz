// src/i18n/routing.ts

import { defineRouting } from "next-intl/routing";

export type Pathnames = {
  "/services": { az: string; en: string; ru: string };
  "/blog": { az: string; en: string; ru: string };
  "/blog/[slug]": { az: string; en: string; ru: string };
  "/services/[slug]": { az: string; en: string; ru: string };
  "/about": { az: string; en: string; ru: string };
  "/contact": { az: string; en: string; ru: string };
  "/certificates": { az: string; en: string; ru: string };
  "/media/video-gallery": { az: string; en: string; ru: string };
  "/media/photo-gallery": { az: string; en: string; ru: string };
  "/partner": { az: string; en: string; ru: string };
};

export const routing = defineRouting({
  locales: ["az", "en", "ru"],
  defaultLocale: "az",
  localePrefix: "as-needed", // 🔴 as-needed-ə qayıtdıq
  localeDetection: false, // 🔴 Loop qarşısını alır
  pathnames: {
    "/services": {
      az: "/xidmetlerimiz",
      en: "/services",
      ru: "/uslugi",
    },
    "/blog": {
      az: "/bloqlar",
      en: "/blogs",
      ru: "/bloqi",
    },
    "/partner": {
      az: "/partnyorlar",
      en: "/partners",
      ru: "/partneri",
    },
    "/blog/[slug]": {
      az: "/bloqlar/[slug]",
      en: "/blogs/[slug]",
      ru: "/bloqi/[slug]",
    },
    "/media/photo-gallery": {
      az: "/media/foto-qaleriya",
      en: "/media/photo-gallery",
      ru: "/medya/foto-galeriya",
    },
    "/media/video-gallery": {
      az: "/media/video-qaleriya",
      en: "/media/video-gallery",
      ru: "/medya/video-galeriya",
    },
    "/certificates": {
      az: "/sertifikatlar",
      en: "/certificates",
      ru: "/sertifikati",
    },
    "/services/[slug]": {
      az: "/xidmetlerimiz/[slug]",
      en: "/services/[slug]",
      ru: "/uslugi/[slug]",
    },
    "/about": {
      az: "/haqqimizda",
      en: "/about",
      ru: "/o-nas",
    },
    "/contact": {
      az: "/elaqe",
      en: "/contact",
      ru: "/kontakti",
    },
  } as const,
});
