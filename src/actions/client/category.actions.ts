"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import {
  CreateCategoryInput,
  createCategorySchema,
  UpdateCategoryInput,
  uptadeCategorySchema,
} from "../../schema/category.schema";
import { Locales, Prisma, Role } from "../../generated/prisma";
import { isUuid } from "../../utils/checkSlug";
import { formatZodErrors } from "../../utils/format-zod-errors";
import { ImgInput, imgSchema } from "@/src/schema/img.schema";
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
  page: number;
  query: string;
  pageSize: number;
  locale: Locales;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};
export async function getCategories({
  page,
  pageSize,
  query,
  locale,
}: GetProps) {
  const customPageSize = Number(pageSize) || Number(12);
  const skip = 0;
  const take = Number(page) * customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.CategoriesWhereInput = {
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
    db.categories.findMany({
      where: whereClause,
      select: {
        status: true,
        documentId: true,
        id: true,
        imageUrl: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        slug: true,
        translations: {
          where: {
            locale: locale,
          },
          select: {
            id: true,
            locale: true,
            title: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    }),
    db.categories.count({ where: whereClause }),
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

export async function getCategoriesById({ locale, id }: GetByIDProps) {
  try {
    const byUuid = isUuid(id);
    const whereClause = byUuid
      ? {
          isDeleted: false,
          documentId: id,
        }
      : {
          isDeleted: false,
          slug: id,
        };

    const category = await db.categories.findFirst({
      where: whereClause,
      include: {
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
            seo: {
              include: {
                imageUrl: {
                  select: {
                    id: true,
                    publicUrl: true,
                    fileKey: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!category) {
      return { message: "Category not found", code: "NOT_FOUND" };
    }
    return { data: category };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return { message: `Internal Server Error - ${errorMessage}` };
  }
}
export async function createCategory(
  input: CreateCategoryInput
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
    const validateData = createCategorySchema.safeParse(input);
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
      slug,
      metaTitle,
      metaDescription,
      locale,
      metaKeywords,
      imageId,
    } = validateData.data;

    const existingData = await db.categories.findFirst({
      where: {
        slug: slug,
        isDeleted: false,
        translations: {
          some: { locale: locale },
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

    const newData = await db.categories.create({
      data: {
        imageId: imageId ? Number(imageId) : null,
        slug: slug,
        translations: {
          create: {
            title: title,
            description: description ?? "",
            locale: locale,
            seo: {
              create: {
                metaTitle: metaTitle || "",
                metaDescription: metaDescription || "",
                metaKeywords: metaKeywords || "",
                imageId: imageId ? Number(imageId) : null,
                locale: locale,
              },
            },
          },
        },
      },
    });
    revalidateAll();
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

export async function uptadeCategory(
  id: string,
  input: UpdateCategoryInput
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
    const existingCategory = await db.categories.findUnique({
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
    const parsedInput = uptadeCategorySchema.safeParse(input);
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
      slug,
      metaTitle,
      metaDescription,
      metaKeywords,
      locale,
    } = parsedInput.data;
    const uptadeData = await db.$transaction(async (prisma) => {
      const updatedData = await prisma.categories.update({
        where: { documentId: id },
        data: {
          slug: slug || existingCategory.slug,
          translations: {
            upsert: {
              where: {
                documentId_locale: { documentId: id, locale },
              },
              create: {
                title: title,
                description: description ?? "",
                locale,
                seo: {
                  create: {
                    metaTitle: metaTitle ?? "",
                    metaDescription: metaDescription ?? "",
                    metaKeywords: metaKeywords ?? "",
                    locale,
                  },
                },
              },
              update: {
                title,
                description,
                seo: {
                  upsert: {
                    create: {
                      metaTitle: metaTitle ?? "",
                      metaDescription: metaDescription ?? "",
                      metaKeywords: metaKeywords ?? "",
                      locale,
                    },
                    update: { metaTitle, metaDescription, metaKeywords },
                  },
                },
              },
            },
          },
        },
        include: {
          translations: { where: { locale: locale }, include: { seo: true } },
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

export async function uptadeCategoryImage(
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
    const existingData = await db.categories.findUnique({
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
    const uptadeData = await db.categories.update({
      where: { documentId: id },
      data: {
        imageId: Number(imageId),
        translations: {
          update: {
            where: {
              documentId_locale: {
                documentId: id,
                locale: "az",
              },
            },
            data: {
              seo: {
                update: {
                  imageId: Number(imageId),
                },
              },
            },
          },
        },
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
