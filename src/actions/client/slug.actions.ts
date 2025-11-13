// app/actions/getTranslatedSlug.ts
"use server";

import { Locales } from "@/src/generated/prisma";
import { db } from "@/src/lib/admin/prismaClient";
import z from "zod";

const LocalesSchema = z.enum(["az", "en", "ru"]);

const ContentTypeSchema = z.enum(["blog", "services"]);

type GetTranslatedSlugParams = {
  currentLocale: string;
  newLocale: string;
  slug: string;
  type: string;
  category?: string;
};

type GetTranslatedSlugResult = {
  success: boolean;
  translatedSlug?: string;
  message?: string;
  errors?: any;
};

export async function getTranslatedSlug(
  params: GetTranslatedSlugParams
): Promise<GetTranslatedSlugResult> {
  try {
    const { currentLocale, newLocale, slug, type } = params;

    // Parametrləri doğrulamaq
    const parsedCurrentLocale = LocalesSchema.safeParse(currentLocale);
    const parsedNewLocale = LocalesSchema.safeParse(newLocale);
    const parsedType = ContentTypeSchema.safeParse(type);

    if (
      !parsedCurrentLocale.success ||
      !parsedNewLocale.success ||
      !parsedType.success
    ) {
      return {
        success: false,
        message: "Incorrect parameters provided",
        errors: {
          currentLocale: parsedCurrentLocale.success
            ? undefined
            : parsedCurrentLocale.error.issues,
          newLocale: parsedNewLocale.success
            ? undefined
            : parsedNewLocale.error.issues,
          type: parsedType.success ? undefined : parsedType.error.issues,
        },
      };
    }

    const currentLang: Locales = parsedCurrentLocale.data;
    const newLang: Locales = parsedNewLocale.data;
    const contentType: z.infer<typeof ContentTypeSchema> = parsedType.data;

    let foundItem: any = null;

    switch (contentType) {
      case "blog":
        foundItem = await db.blog.findFirst({
          where: {
            isDeleted: false,
            translations: {
              some: {
                slug: slug,
                locale: currentLang,
              },
            },
          },
          include: {
            translations: {
              where: {
                locale: newLang,
              },
              select: {
                slug: true,
              },
            },
          },
        });
        break;

      case "services":
        foundItem = await db.services.findFirst({
          where: {
            isDeleted: false,
            translations: {
              some: {
                slug: slug,
                locale: currentLang,
              },
            },
          },
          include: {
            translations: {
              where: {
                locale: newLang,
              },
              select: {
                slug: true,
              },
            },
          },
        });
        break;

      default:
        return {
          success: false,
          message: "Invalid content type provided.",
        };
    }

    const translatedSlug = foundItem?.translations[0]?.slug;

    return {
      success: true,
      translatedSlug: translatedSlug || slug,
    };
  } catch (error) {
    console.error("Error fetching translated slug:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      message: "Internal Server Error",
      errors: errorMessage,
    };
  }
}
