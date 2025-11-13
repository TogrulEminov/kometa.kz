"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Prisma, Role } from "../../generated/prisma";
import { isUuid } from "../../utils/checkSlug";
import { formatZodErrors } from "../../utils/format-zod-errors";

import {
  IconsInput,
  iconsSchema,
  ImgInput,
  imgSchema,
} from "@/src/schema/img.schema";
import { createSlug } from "@/src/lib/slugifyHelper";
import {
  CreateServicesInput,
  createServicesSchema,
  UpdateServicesInput,
  updateServicesSchema,
} from "@/src/schema/service.schema";
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
  page?: number;
  query?: string;
  pageSize?: number;
  locale: Locales;
  // sort?: string;
};

type GetByIDProps = {
  id: string;
  locale: Locales;
};

export async function getService({ page, pageSize, query, locale }: GetProps) {
  const customPage = Number(page) || 1;
  const customPageSize = Number(pageSize) || 12;
  const skip = (Number(customPage) - 1) * customPageSize;
  const take = customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.ServicesWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale: locale,
        ...(searchTerm && {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }),
      },
    },
  };

  const [data, totalCount] = await Promise.all([
    db.services.findMany({
      where: whereClause,
      select: {
        status: true,
        documentId: true,
        id: true,
        iconsUrl: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },
        imageUrl: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },

        createdAt: true,
        updatedAt: true,
        translations: {
          where: { locale: locale },
          select: {
            id: true,
            locale: true,
            slug: true,
            title: true,
            description: true,
            shortDescription: true,
            documentId: true,
          },
        },
      },
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.services.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / customPageSize);

  return {
    message: "Success",
    data: totalCount < 1 ? [] : data,
    paginations: {
      page,
      pageSize: customPageSize,
      totalPages: totalPages,
      dataCount: totalCount,
    },
  };
}

export async function getServiceById({ locale, id }: GetByIDProps) {
  try {
    const byUuid = isUuid(id);
    const whereClause = byUuid
      ? {
          isDeleted: false,
          documentId: id,
        }
      : {
          isDeleted: false,
          translations: {
            some: { slug: id, locale },
          },
        };

    const existingData = await db.services.findFirst({
      where: whereClause,
      include: {
        iconsUrl: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },
        imageUrl: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },
        translations: {
          where: { locale },
          include: {
            seo: true,
          },
        },
      },
    });

    if (!existingData) {
      return {
        message: "Data not found",
        code: "NOT_FOUND",
        success: false,
      };
    }

    return { data: existingData, success: true };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      message: `Internal Server Error - ${errorMessage}`,
      success: false,
      code: "SERVER_ERROR",
    };
  }
}

export async function createServices(
  input: CreateServicesInput
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
    const validateData = createServicesSchema.safeParse(input);
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
      metaTitle,
      metaDescription,
      locale,
      metaKeywords,
      imageId,
      fags,
      shortDescription,
      advantages,
      iconsId,
      features,
      orderNumber,
    } = validateData.data;

    const customSlug = createSlug(title);

    // Check if slug already exists for this locale
    const existingData = await db.services.findFirst({
      where: {
        isDeleted: false,
        translations: {
          some: { locale: locale, slug: customSlug },
        },
      },
    });

    if (existingData) {
      return {
        success: false,
        error: "Bu başlıq ilə məqalə artıq mövcuddur",
        code: "DUPLICATE",
      };
    }

    // ✅ Use transaction for proper SEO creation
    const newData = await db.$transaction(async (prisma) => {
      // 1. Create SEO first
      const seo = await prisma.seo.create({
        data: {
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || description || "",
          metaKeywords: metaKeywords || "",
          imageId: imageId ? Number(imageId) : null,
          locale: locale,
        },
      });

      // 2. Create Blog with translation connected to SEO
      const blog = await prisma.services.create({
        data: {
          orderNumber,
          imageId: imageId ? Number(imageId) : null,
          iconsId: imageId ? Number(iconsId) : null,
          translations: {
            create: {
              title: title,
              slug: customSlug,
              description: description || "",
              advantages: JSON.stringify(advantages),
              shortDescription: shortDescription || "",
              features: JSON.stringify(features),
              fags: JSON.stringify(fags),
              locale: locale,
              seoId: seo.id,
            },
          },
        },
        include: {
          translations: {
            where: { locale },
            include: { seo: true },
          },
        },
      });

      return blog;
    });
    revalidateAll();
    return {
      success: true,
      data: newData,
      code: "SUCCESS",
      message: "Məqalə uğurla yaradıldı",
    };
  } catch (error) {
    console.error("createBlog error:", error);

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

export async function updateServices(
  id: string,
  input: UpdateServicesInput
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
    const existingData = await db.services.findUnique({
      where: {
        documentId: id,
        isDeleted: false,
      },
      include: {
        translations: {
          include: {
            seo: true,
          },
        },
      },
    });

    if (!existingData) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Məqalə tapılmadı",
      };
    }

    const parsedInput = updateServicesSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Validation failed",
        errors: formatZodErrors(parsedInput.error),
      };
    }

    const {
      title,
      description,
      metaTitle,
      metaDescription,
      metaKeywords,
      locale,
      fags,
      features,
      shortDescription,
      advantages,
      orderNumber,
    } = parsedInput.data;

    const customSlug = createSlug(title);

    const updatedData = await db.$transaction(async (prisma) => {
      // Find existing translation
      const existingTranslation = existingData.translations.find(
        (t) => t.locale === locale
      );

      if (existingTranslation) {
        // ✅ UPDATE: Translation exists
        if (existingTranslation.seoId) {
          // Update existing SEO
          await prisma.seo.update({
            where: { id: existingTranslation.seoId },
            data: {
              metaTitle: metaTitle || title,
              metaDescription: metaDescription || description || "",
              metaKeywords: metaKeywords || "",
            },
          });
        } else {
          // Create new SEO and link it
          const newSeo = await prisma.seo.create({
            data: {
              metaTitle: metaTitle || title,
              metaDescription: metaDescription || description || "",
              metaKeywords: metaKeywords || "",
              locale: locale,
            },
          });

          await prisma.servicesTranslations.update({
            where: { id: existingTranslation.id },
            data: {
              seoId: newSeo.id,
            },
          });
        }

        // Update translation
        await prisma.services.update({
          where: {
            id: existingTranslation?.id,
          },
          data: {
            orderNumber,
          },
        });
        await prisma.servicesTranslations.update({
          where: { id: existingTranslation.id },
          data: {
            title,
            description: description || "",
            slug: customSlug,
            advantages: JSON.stringify(advantages),
            fags: JSON.stringify(fags),
            shortDescription: shortDescription || "",
            features: JSON.stringify(features),
          },
        });
      } else {
        // ✅ CREATE: Translation doesn't exist
        const newSeo = await prisma.seo.create({
          data: {
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || description || "",
            metaKeywords: metaKeywords || "",
            locale: locale,
          },
        });
        await prisma.services.update({
          where: {
            documentId: id,
          },
          data: {
            orderNumber,
          },
        });
        await prisma.servicesTranslations.create({
          data: {
            documentId: id,
            title: title,
            description: description || "",
            locale,
            slug: customSlug,
            advantages: JSON.stringify(advantages),
            fags: JSON.stringify(fags),
            features: JSON.stringify(features),
            shortDescription: shortDescription || "",
            seoId: newSeo.id,
          },
        });
      }

      // Return updated blog
      return await prisma.services.findUnique({
        where: { documentId: id },
        include: {
          translations: {
            where: { locale: locale },
            include: { seo: true },
          },
        },
      });
    });
    revalidateAll();
    return {
      success: true,
      data: updatedData,
      code: "SUCCESS",
      message: "Məqalə uğurla yeniləndi",
    };
  } catch (error) {
    console.error("updateBlog error:", error);
    const errorMessage = (error as Error).message;
    return {
      success: false,
      error: `Internal Server Error - ${errorMessage}`,
      code: "SERVER_ERROR",
    };
  }
}

export async function updateServicesMainImage(
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
    const existingData = await db.services.findUnique({
      where: { documentId: id, isDeleted: false },
    });

    if (!existingData) {
      return {
        error: "Məqalə tapılmadı",
        code: "NOT_FOUND",
        success: false,
      };
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

    const updatedData = await db.services.update({
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

export async function updateServicesIconsImage(
  id: string,
  input: IconsInput
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
    const existingData = await db.services.findUnique({
      where: { documentId: id, isDeleted: false },
    });

    if (!existingData) {
      return {
        error: "Məqalə tapılmadı",
        code: "NOT_FOUND",
        success: false,
      };
    }

    const parsedInput = iconsSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(parsedInput.error),
      };
    }

    const { iconsId } = parsedInput.data;

    const updatedData = await db.services.update({
      where: { documentId: id },
      data: {
        iconsId: Number(iconsId),
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
