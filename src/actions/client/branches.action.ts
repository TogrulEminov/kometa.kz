// src/actions/branches.action.ts
"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Prisma, Role } from "../../generated/prisma";
import { isUuid } from "../../utils/checkSlug";
import { formatZodErrors } from "../../utils/format-zod-errors";
import {
  CreateBranchInput,
  createBranchSchema,
  UpdateBranchInput,
  updateBranchSchema,
  CreateOfficeInput,
  createOfficeSchema,
  UpdateOfficeInput,
  updateOfficeSchema,
} from "../../schema/bracnhes.schema";
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
};

type GetByIDProps = {
  id: string;
  locale: Locales;
};

// ==================== BRANCH ACTIONS ====================

export async function getBranches({ page, pageSize, query, locale }: GetProps) {
  const customPage = Number(page) || Number(1);
  const customPageSize = Number(pageSize) || Number(12);
  const skip = 0;
  const take = Number(customPage) * customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.BranchWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale: locale,
        ...(searchTerm && {
          countryName: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }),
      },
    },
  };

  const [data, totalCount] = await Promise.all([
    db.branch.findMany({
      where: whereClause,
      select: {
        status: true,
        documentId: true,
        id: true,
        isoCode: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          where: {
            locale: locale,
          },
          select: {
            id: true,
            locale: true,
            countryName: true,
            documentId: true,
          },
        },
        offices: {
          where: { isDeleted: false },
          select: {
            id: true,
            latitude: true,
            longitude: true,
            documentId: true,
            type: true,
            translations: {
              select: {
                city: true,
                address: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    }),
    db.branch.count({ where: whereClause }),
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

export async function getBranchById({ locale, id }: GetByIDProps) {
  try {
    const byUuid = isUuid(id);
    const whereClause = byUuid
      ? {
          isDeleted: false,
          documentId: id,
        }
      : {
          isDeleted: false,
          isoCode: id,
        };

    const branch = await db.branch.findFirst({
      where: whereClause,
      include: {
        translations: {
          where: { locale },
        },
        offices: {
          where: { isDeleted: false },
        },
      },
    });

    if (!branch) {
      return { message: "Branch not found", code: "NOT_FOUND" };
    }

    return { data: branch };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return { message: `Internal Server Error - ${errorMessage}` };
  }
}

export async function createBranch(
  input: CreateBranchInput
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
    const validateData = createBranchSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }

    const { isoCode, countryName, status, locale } = validateData.data;

    // Check if branch with same isoCode exists
    const existingBranch = await db.branch.findFirst({
      where: {
        isoCode: isoCode,
        isDeleted: false,
      },
    });

    if (existingBranch) {
      return {
        success: false,
        error: "Branch with this ISO code already exists",
        code: "DUPLICATE",
      };
    }

    const newBranch = await db.branch.create({
      data: {
        isoCode: isoCode,
        status: status || "ACTIVE",
        translations: {
          create: {
            countryName: countryName,
            locale: locale,
          },
        },
      },
      include: {
        translations: true,
      },
    });

    return {
      success: true,
      data: newBranch,
      code: "SUCCESS",
      message: "Branch created successfully",
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

export async function updateBranch(
  id: string,
  input: UpdateBranchInput
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
    const existingBranch = await db.branch.findUnique({
      where: {
        documentId: id,
        isDeleted: false,
      },
      include: {
        translations: true,
      },
    });

    if (!existingBranch) {
      return { success: false, code: "NOT_FOUND", error: "Branch not found" };
    }

    const parsedInput = updateBranchSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Validation failed",
        errors: formatZodErrors(parsedInput.error),
      };
    }

    const { countryName, status, locale } = parsedInput.data;

    const updatedBranch = await db.$transaction(async (prisma) => {
      const updated = await prisma.branch.update({
        where: { documentId: id },
        data: {
          status: status || existingBranch.status,
          translations: {
            upsert: {
              where: {
                documentId_locale: { documentId: id, locale },
              },
              create: {
                countryName: countryName,
                locale,
              },
              update: {
                countryName,
              },
            },
          },
        },
        include: {
          translations: { where: { locale: locale } },
          offices: { where: { isDeleted: false } },
        },
      });

      return updated;
    });
    revalidateAll();
    return {
      success: true,
      data: updatedBranch,
      code: "SUCCESS",
      message: "Branch updated successfully",
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      success: false,
      error: `Internal Server Error - ${errorMessage}`,
      code: "SERVER_ERROR",
    };
  }
}

export async function deleteBranch(id: string): Promise<ActionResult> {
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
    const existingBranch = await db.branch.findUnique({
      where: { documentId: id, isDeleted: false },
    });

    if (!existingBranch) {
      return { success: false, code: "NOT_FOUND", error: "Branch not found" };
    }

    await db.branch.update({
      where: { documentId: id },
      data: { isDeleted: true },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      message: "Branch deleted successfully",
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
// ==================== OFFICE ACTIONS ====================

export async function getOfficesByBranch(branchId: string, locale: Locales) {
  try {
    const offices = await db.office.findMany({
      where: {
        branchId: branchId,
        isDeleted: false,
      },
      select: {
        id: true,
        documentId: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        translations: {
          where: { locale },
          select: {
            id: true,
            documentId: true,
            city: true,
            address: true,
            locale: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: offices,
      code: "SUCCESS",
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      success: false,
      error: `Internal Server Error - ${errorMessage}`,
      code: "SERVER_ERROR",
    };
  }
}

export async function getOfficeById(id: string, locale: Locales) {
  try {
    const office = await db.office.findUnique({
      where: {
        documentId: id,
        isDeleted: false,
      },
      include: {
        translations: {
          where: { locale },
        },
      },
    });

    if (!office) {
      return { success: false, code: "NOT_FOUND", error: "Office not found" };
    }

    return {
      success: true,
      data: office,
      code: "SUCCESS",
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      success: false,
      error: `Internal Server Error - ${errorMessage}`,
      code: "SERVER_ERROR",
    };
  }
}

export async function createOffice(
  input: CreateOfficeInput
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
    const validateData = createOfficeSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }

    const { branchId, city, address, type, latitude, longitude, locale } =
      validateData.data;

    // Check if branch exists
    const branch = await db.branch.findUnique({
      where: { documentId: branchId, isDeleted: false },
    });

    if (!branch) {
      return {
        success: false,
        error: "Branch not found",
        code: "NOT_FOUND",
      };
    }

    const newOffice = await db.office.create({
      data: {
        branchId: branchId,
        latitude: latitude,
        type: type ?? "office",
        longitude: longitude,
        translations: {
          create: {
            city: city,
            address: address,
            locale: locale,
          },
        },
      },
      include: {
        translations: true,
      },
    });
    revalidateAll();
    return {
      success: true,
      data: newOffice,
      code: "SUCCESS",
      message: "Office created successfully",
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

export async function updateOffice(
  id: string,
  input: UpdateOfficeInput
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
    const existingOffice = await db.office.findUnique({
      where: { documentId: id, isDeleted: false },
      include: { translations: true },
    });

    if (!existingOffice) {
      return { success: false, code: "NOT_FOUND", error: "Office not found" };
    }

    const parsedInput = updateOfficeSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Validation failed",
        errors: formatZodErrors(parsedInput.error),
      };
    }

    const { city, address, latitude, longitude, type, locale } =
      parsedInput.data;

    const updatedOffice = await db.$transaction(async (prisma) => {
      // First update the office coordinates
      await prisma.office.update({
        where: { documentId: id },
        data: {
          type: type ?? existingOffice.type,
          latitude: latitude !== undefined ? latitude : existingOffice.latitude,
          longitude:
            longitude !== undefined ? longitude : existingOffice.longitude,
        },
      });

      // Then upsert the translation
      await prisma.officeTranslation.upsert({
        where: {
          office_locale_unique: {
            officeDocumentId: id,
            locale: locale,
          },
        },
        create: {
          officeDocumentId: id,
          city: city,
          address: address,
          locale: locale,
        },
        update: {
          city: city,
          officeDocumentId: id,
          address: address,
          locale: locale,
        },
      });

      // Fetch and return the updated office with translations
      return await prisma.office.findUnique({
        where: { documentId: id },
        include: {
          translations: { where: { locale } },
        },
      });
    });
    revalidateAll();
    return {
      success: true,
      data: updatedOffice,
      code: "SUCCESS",
      message: "Office updated successfully",
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      success: false,
      error: `Internal Server Error - ${errorMessage}`,
      code: "SERVER_ERROR",
    };
  }
}

export async function deleteOffice(id: string): Promise<ActionResult> {
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
    const existingOffice = await db.office.findUnique({
      where: { documentId: id, isDeleted: false },
    });

    if (!existingOffice) {
      return { success: false, code: "NOT_FOUND", error: "Office not found" };
    }

    await db.office.update({
      where: { documentId: id },
      data: { isDeleted: true },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      message: "Office deleted successfully",
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
