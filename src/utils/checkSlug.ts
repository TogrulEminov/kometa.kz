import { NextRequest } from "next/server";
import z from "zod";
import { routing } from "../i18n/routing";

export function isUuid(id: string): boolean {
  if (typeof id !== "string" || id.length === 0) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const cuidRegex = /^[a-z0-9]{16,32}$/;

  return uuidRegex.test(id) || cuidRegex.test(id);
}
const LocalesSchema = z.enum(["az", "en", "ru"]);
type SupportedLocale = z.infer<typeof LocalesSchema>;
export function parseLocaleFromReq(req: NextRequest): SupportedLocale | null {
  const loc = req.nextUrl.searchParams.get("locale") ?? "az";
  const parsed = LocalesSchema.safeParse(loc);
  return parsed.success ? parsed.data : null;
}

export function getPageUrl({
  locale,
  customPath,
  slug,
}: {
  locale: string;
  customPath: string;
  slug?: string;
}): string {
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  // Home page
  if (customPath === "home") {
    return locale === "az" ? baseUrl : `${baseUrl}/${locale}`;
  }

  // Path key
  const pathKey = `/${customPath}${slug ? "/[slug]" : ""}`;
  const pathnames = (
    routing.pathnames as Record<string, Record<string, string>>
  )[pathKey];

  if (!pathnames) {
    const fallbackPath = slug ? `${customPath}/${slug}` : customPath;
    return locale === "az"
      ? `${baseUrl}/${fallbackPath}`
      : `${baseUrl}/${locale}/${fallbackPath}`;
  }

  // String kimi işlə
  let localizedPath = String(pathnames[locale] || `/${customPath}`);

  // Slug replacement
  if (slug) {
    localizedPath = localizedPath.replace("[slug]", slug);
  }

  // Clean path
  const cleanPath = localizedPath.replace(/^\/+/, "");

  // Return URL
  return locale === "az"
    ? `${baseUrl}/${cleanPath}`
    : `${baseUrl}/${locale}/${cleanPath}`;
}
export const parseJSON = <T>(data: any): T[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
