"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";

import { Locales, Prisma, Role } from "../../generated/prisma";
import { isUuid } from "../../utils/checkSlug";
import { formatZodErrors } from "../../utils/format-zod-errors";
import { ImgInput, imgSchema } from "@/src/schema/img.schema";
import {
  CreateEmployeeInput,
  createEmployeeSchema,
  UpdateEmployeeInput,
  uptadeEmployeeSchema,
} from "@/src/schema/employee.schema";
import { createSlug } from "@/src/lib/slugifyHelper";
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
  query?: string;
  pageSize: number;
  locale: Locales;
  emailRespone?: boolean;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};
export async function getEmployee({
  page,
  pageSize,
  query,
  locale,
  emailRespone,
}: GetProps) {
  const customPageSize = Number(pageSize) || Number(12);
  const skip = 0;
  const take = Number(page) * customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.EmployeeWhereInput = {
    isDeleted: false,
    ...(emailRespone !== undefined && { emailResponse: emailRespone }),
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
    db.employee.findMany({
      where: whereClause,
      select: {
        status: true,
        documentId: true,
        email: true,
        experience: true,
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
        translations: {
          where: {
            locale: locale,
          },

          select: {
            id: true,
            slug: true,
            locale: true,
            position: true,
            title: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    }),
    db.employee.count({ where: whereClause }),
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

export async function getEmployeeById({ locale, id }: GetByIDProps) {
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

    const category = await db.employee.findFirst({
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
export async function createEmployee(
  input: CreateEmployeeInput
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
    const validateData = createEmployeeSchema.safeParse(input);
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
      imageId,
      orderNumber,
      positionId,
      emailResponse,
      email,
    } = validateData.data;

    const customSlug = createSlug(title);
    const existingData = await db.employee.findFirst({
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
        error: "Data with this title and slug already exists",
        code: "DUPLICATE",
      };
    }

    const newData = await db.employee.create({
      data: {
        orderNumber: Number(orderNumber) || null,
        emailResponse,
        email: email ?? "",
        imageId: imageId ? Number(imageId) : null,
        translations: {
          create: {
            title: title,
            description: description ?? "",
            locale: locale,
            slug: customSlug,
            positionId: positionId,
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

export async function uptadeEmployee(
  id: string,
  input: UpdateEmployeeInput
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
    const existingCategory = await db.employee.findUnique({
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
    const parsedInput = uptadeEmployeeSchema.safeParse(input);
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
      locale,
      orderNumber,
      positionId,
      emailResponse,
      email,
    } = parsedInput.data;

    const customSlug = createSlug(title);
    const uptadeData = await db.$transaction(async (prisma) => {
      const updatedData = await prisma.employee.update({
        where: { documentId: id },
        data: {
          orderNumber: Number(orderNumber) || null,
          email: email ?? "",
          emailResponse,
          translations: {
            upsert: {
              where: {
                documentId_locale: { documentId: id, locale },
              },
              create: {
                title: title,
                description: description ?? "",
                locale,
                slug: customSlug,
                positionId: positionId,
              },
              update: {
                title: title,
                description: description ?? "",
                locale,
                slug: customSlug,
                positionId: positionId,
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

export async function uptadeEmployeeImage(
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
    const existingData = await db.employee.findUnique({
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
    const uptadeData = await db.employee.update({
      where: { documentId: id },
      data: {
        imageId: Number(imageId),
        translations: {},
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
