"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Prisma, Role } from "../../generated/prisma";
import { isUuid } from "../../utils/checkSlug";
import { formatZodErrors } from "../../utils/format-zod-errors";
import {
  GalleryInput,
  gallerySchema,
  ImgInput,
  imgSchema,
} from "@/src/schema/img.schema";

import { createSlug } from "@/src/lib/slugifyHelper";
import { checkAuthServerAction } from "@/src/middleware/checkAuthorization";
import { revalidateAll } from "@/src/utils/revalidation";
import {
  CreatePhotoesInput,
  createPhotoesSchema,
  UpdatePhotoesInput,
  uptadePhotoesSchema,
} from "@/src/schema/photo-gallery.schema";

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  code: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

type GetProps = {
  page: number;
  query?: string;
  pageSize: number;
  locale: Locales;
  sort?: string;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};
export async function getGallery({
  page,
  pageSize,
  query,
  locale,
  sort = "desc",
}: GetProps) {
  const customPageSize = Number(pageSize) || Number(12);
  const skip = 0;
  const take = Number(page) * customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.PhotoGalleryWhereInput = {
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
    db.photoGallery.findMany({
      where: whereClause,
      select: {
        status: true,
        documentId: true,
        id: true,
        imageUrl: true,
        gallery: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },

        createdAt: true,
        updatedAt: true,
        translations: {
          where: {
            locale: locale,
          },
          select: {
            slug: true,
            id: true,
            locale: true,
            title: true,
            description: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: (sort as Prisma.SortOrder) ?? "desc" },
      skip: skip,
      take: take,
    }),
    db.photoGallery.count({ where: whereClause }),
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

export async function getGalleryById({ locale, id }: GetByIDProps) {
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

    const existingData = await db.photoGallery.findFirst({
      where: whereClause,
      include: {
        imageUrl: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },
        gallery: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },
        translations: {
          where: { locale },
        },
      },
    });

    if (!existingData) {
      return { message: "Data not found", code: "NOT_FOUND" };
    }
    return { data: existingData };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return { message: `Internal Server Error - ${errorMessage}` };
  }
}
export async function createGallery(
  input: CreatePhotoesInput
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
    const validateData = createPhotoesSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }
    const { title, galleryIds, locale, imageId } = validateData.data;
    const custom_slug = createSlug(title);

    const existingData = await db.photoGallery.findFirst({
      where: {
        isDeleted: false,
        translations: {
          some: { locale: locale, slug: custom_slug },
        },
      },
    });

    if (existingData) {
      return {
        success: false,
        error: "Data with this title and slug already exists",
        code: "DUPLICATE",
      };
    }

    const newData = await db.photoGallery.create({
      data: {
        imageId: Number(imageId) || null,
        gallery: {
          connect: galleryIds?.map((id) => ({ id: Number(id) })),
        },
        translations: {
          create: {
            slug: custom_slug,
            title: title,
            locale: locale,
          },
        },
      },
    });
    return {
      success: true,
      data: newData,
      code: "SUCCESS",
      message: "Data created successfully",
    };
  } catch (error) {
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

export async function uptadeGalleryContent(
  id: string,
  input: UpdatePhotoesInput
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
    const existingCategory = await db.photoGallery.findUnique({
      where: {
        documentId: id,
        isDeleted: false,
      },
      include: {
        translations: true,
      },
    });
    if (!existingCategory) {
      return { success: false, code: "NOT_FOUND", error: "Category not found" };
    }
    const parsedInput = uptadePhotoesSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Validation failed",
        errors: formatZodErrors(parsedInput.error),
      };
    }
    const { title, locale } = parsedInput.data;
    const customSlug = createSlug(title);

    const uptadeData = await db.$transaction(async (prisma) => {
      const updatedData = await prisma.photoGallery.update({
        where: { documentId: id },
        data: {
          translations: {
            upsert: {
              where: {
                documentId_locale: {
                  documentId: id,
                  locale,
                },
              },
              create: {
                title: title,
                locale,
                slug: customSlug || existingCategory.translations?.[0]?.slug,
              },
              update: {
                title,
                slug: customSlug || existingCategory.translations?.[0]?.slug,
              },
            },
          },
        },
        include: {
          translations: { where: { locale: locale } },
        },
      });

      return updatedData;
    });
    revalidateAll();
    return { success: true, data: uptadeData, code: "Success" };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      success: false,
      error: `Internal Server Error - ${errorMessage}`,
      code: "SERVER_ERROR",
    };
  }
}

export async function uptadePhotoImage(
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
    const existingData = await db.photoGallery.findUnique({
      where: { documentId: id, isDeleted: false },
    });
    if (!existingData) {
      return { error: "Category not found", code: "NOT_FOUND", success: false };
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
    const uptadeData = await db.photoGallery.update({
      where: { documentId: id },
      data: {
        imageId: Number(imageId),
      },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      data: uptadeData,
      message: "Uptade is successfully",
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
export async function uptadeGalleryImages(
  id: string,
  input: GalleryInput
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
    const existingData = await db.photoGallery.findUnique({
      where: { documentId: id, isDeleted: false },
    });
    if (!existingData) {
      return { error: "Category not found", code: "NOT_FOUND", success: false };
    }
    const parsedInput = gallerySchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(parsedInput.error),
      };
    }
    const { galleryIds } = parsedInput.data;
    const uptadeData = await db.photoGallery.update({
      where: { documentId: id },
      data: {
        gallery: {
          connect: galleryIds?.map((id) => ({ id: Number(id) })),
        },
      },
    });
    return {
      success: true,
      code: "SUCCESS",
      data: uptadeData,
      message: "Uptade is successfully",
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
