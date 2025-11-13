"use server";
import { Locale } from "next-intl";
import { getTranslatedSlug } from "../client/slug.actions";
import { db } from "@/src/lib/admin/prismaClient";

export async function getSlug(
  currentLocale: Locale,
  newLocale: Locale,
  slug: string,
  type: string
): Promise<string> {
  const validPagesRouting = {
    // blog
    bloqlar: "blog",
    blogs: "blog",
    bloqi: "blog",
    blog: "blog",

    // services
    services: "services",
    xidmetlerimiz: "services",
    uslugi: "services",
  } as const;

  type ValidPageRoutingKey = keyof typeof validPagesRouting;
  const normalizedType = validPagesRouting[type as ValidPageRoutingKey] || type;

  const response = await getTranslatedSlug({
    currentLocale: currentLocale,
    newLocale: newLocale,
    slug: slug,
    type: normalizedType,
  });

  if (!response.success || !response.translatedSlug) {
    return slug;
  }

  return response.translatedSlug;
}
type DynamicModelName = "services" | "blog";
export async function getDynamicItemsForLocale(
  modelName: DynamicModelName,
  locale: string
) {
  const modelDelegate = db[modelName as keyof typeof db];
  if (!modelDelegate) {
    return [];
  }

  const items = await (modelDelegate as any).findMany({
    select: {
      createdAt: true,
      updatedAt: true,
      translations: {
        where: {
          locale: locale,
        },
        select: {
          slug: true,
        },
      },
    },
  });

  return items
    .map((item: any) => {
      const translation = item.translations[0];
      if (!translation) return null;
      return {
        slug: translation.slug,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    })
    .filter(Boolean); // Tərcüməsi olmayanları siyahıdan çıxarırıq
}
