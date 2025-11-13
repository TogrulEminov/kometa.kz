"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Role } from "../../generated/prisma";
import { formatZodErrors } from "../../utils/format-zod-errors";
import { ImgInput, imgSchema } from "@/src/schema/img.schema";
import { createSlug } from "@/src/lib/slugifyHelper";
import { UpsertHeroInput, upsertHeroSchema } from "@/src/schema/hero.schema";
import { generateUUID } from "@/src/lib/uuidHelper";
import { checkAuthServerAction } from "@/src/middleware/checkAuthorization";
import { revalidateAll } from "@/src/utils/revalidation";

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  code: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

type GetProps = {
  locale: Locales;
};

export async function getHero({ locale }: GetProps) {
  const existingItem = await db.hero.findFirst({
    include: {
      imageUrl: {
        select: {
          id: true,
          fileKey: true,
          originalName: true,
          mimeType: true,
          publicUrl: true,
          fileSize: true,
        },
      },
      translations: {
        where: { locale },
      },
    },
  });

  return {
    message: "Success",
    data: existingItem,
  };
}

export async function upsertHero(
  input: UpsertHeroInput
): Promise<ActionResult> {
  const { user, error } = await checkAuthServerAction([
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.CONTENT_MANAGER,
  ]);

  if (error || !user) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: error || "Giriş edilməyib",
    };
  }
  try {
    // Validate input
    const validateData = upsertHeroSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }

    const {
      title,
      description,
      locale,
      badge,
      subtitle,
      primaryButton,
      secondaryButton,
      features,
      highlightWord,
      statistics,
    } = validateData.data;

    const custom_slug = createSlug(title);

    const result = await db.$transaction(async (prisma) => {
      // 1. Get or Create Hero record (only ONE should exist)
      let mainRecord = await prisma.hero.findFirst({
        where: { isDeleted: false },
      });

      if (!mainRecord) {
        const uuid = generateUUID();
        mainRecord = await prisma.hero.create({
          data: {
            documentId: uuid,
          },
        });
      } else {
        // Update slug on main record if title changes
        mainRecord = await prisma.hero.update({
          where: { id: mainRecord.id },
          data: {
            documentId: mainRecord.documentId,
          },
        });
      }

      // 2. Upsert translation (automatically handles create/update)
      const translation = await prisma.heroTranslations.upsert({
        where: {
          documentId_locale: {
            documentId: mainRecord.documentId,
            locale: locale,
          },
        },
        update: {
          title,
          description: description || "",
          badge,
          subtitle,
          slug: custom_slug,
          secondaryButton,
          primaryButton,
          highlightWord,
          features: JSON.stringify(features),
          statistics: JSON.stringify(statistics),
        },
        create: {
          documentId: mainRecord.documentId,
          title,
          description: description || "",
          highlightWord,
          badge,
          subtitle,
          secondaryButton,
          primaryButton,
          slug: custom_slug,
          locale: locale,
          statistics: JSON.stringify(statistics),
          features: JSON.stringify(features),
        },
      });

      // 3. Return complete data
      return {
        ...mainRecord,
        translations: [translation],
      };
    });
    revalidateAll();
    return {
      success: true,
      data: result,
      code: "SUCCESS",
      message: "Məlumat uğurla yadda saxlandı",
    };
  } catch (error) {
    console.error("upsertHero error:", error);

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        success: false,
        error: "Məlumatlar düzgün deyil",
        errors: fieldErrors,
        code: "VALIDATION_ERROR",
      };
    }

    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Məlumat yadda saxlanarkən xəta baş verdi",
    };
  }
}
export async function updateHeroImage(
  id: string,
  input: ImgInput
): Promise<ActionResult> {
  const { user, error } = await checkAuthServerAction([
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.CONTENT_MANAGER,
  ]);

  if (error || !user) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: error || "Giriş edilməyib",
    };
  }
  try {
    const existingData = await db.hero.findUnique({
      where: { documentId: id, isDeleted: false },
    });

    if (!existingData) {
      return { error: "Data not found", code: "NOT_FOUND", success: false };
    }

    const parsedInput = imgSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(parsedInput.error),
      };
    }

    const { imageId } = parsedInput.data;

    const updatedData = await db.hero.update({
      where: { documentId: id },
      data: {
        imageId: Number(imageId),
      },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      data: updatedData,
      message: "Şəkil uğurla yeniləndi",
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      success: false,
      code: "SERVER_ERROR",
      error: `Internal Server Error - ${errorMessage}`,
    };
  }
}
