"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Prisma, Role, Status } from "../../generated/prisma";
import { formatZodErrors } from "../../utils/format-zod-errors";
import {
  CreateSocialInput,
  UpdateSocialInput,
  createSocialSchema,
  updateSocialSchema,
} from "@/src/schema/social.schema";
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
  status?: Status;
};

type GetByIDProps = {
  id: string;
};

// GET ALL SOCIALS
export async function getSocials({
  page = 1,
  pageSize = 12,
  query,
  status,
}: GetProps) {
  try {
    const customPage = page || 1;
    const customPageSize = Number(pageSize) || 12;
    const skip = (customPage - 1) * customPageSize;
    const take = customPageSize;
    const searchTerm = query?.trim();

    const whereClause: Prisma.SocialWhereInput = searchTerm
      ? {
          OR: [
            { socialName: { contains: searchTerm, mode: "insensitive" } },
            { socialLink: { contains: searchTerm, mode: "insensitive" } },
          ],
        }
      : {};

    const [data, totalCount] = await Promise.all([
      db.social.findMany({
        where: {
          ...whereClause,
          status: status,
        },
        orderBy: { createdAt: "asc" },
        skip: skip,
        take: take,
      }),
      db.social.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / customPageSize);

    return {
      success: true,
      code: "SUCCESS",
      message: "Socials fetched successfully",
      data: data,
      paginations: {
        page: customPage,
        pageSize: customPageSize,
        totalPages: totalPages,
        dataCount: totalCount,
      },
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

// GET SOCIAL BY ID
export async function getSocialById({
  id,
}: GetByIDProps): Promise<ActionResult> {
  try {
    const existingData = await db.social.findUnique({
      where: {
        documentId: id,
      },
    });

    if (!existingData) {
      return {
        success: false,
        message: "Social not found",
        code: "NOT_FOUND",
      };
    }

    return {
      success: true,
      code: "SUCCESS",
      data: existingData,
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

// CREATE SOCIAL
export async function createSocial(
  input: CreateSocialInput
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
    const validateData = createSocialSchema.safeParse(input);

    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }

    const { socialName, socialLink, iconName, status } = validateData.data;

    // Check duplicate socialName
    const existingSocialName = await db.social.findUnique({
      where: { socialName: socialName },
    });

    if (existingSocialName) {
      return {
        success: false,
        error: "Bu adda sosial şəbəkə artıq mövcuddur",
        code: "DUPLICATE",
      };
    }

    // Check duplicate socialLink
    const existingSocialLink = await db.social.findUnique({
      where: { socialLink: socialLink },
    });

    if (existingSocialLink) {
      return {
        success: false,
        error: "Bu link artıq mövcuddur",
        code: "DUPLICATE",
      };
    }

    const newData = await db.social.create({
      data: {
        socialName,
        socialLink,
        iconName,
        status: status || Status.published,
      },
    });
    revalidateAll();
    return {
      success: true,
      data: newData,
      code: "SUCCESS",
      message: "Sosial şəbəkə uğurla yaradıldı",
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

    const errorMessage = (error as Error).message;
    return {
      success: false,
      code: "SERVER_ERROR",
      error: `Məlumat yadda saxlanarkən xəta baş verdi - ${errorMessage}`,
    };
  }
}

// UPDATE SOCIAL
export async function updateSocial(
  id: string,
  input: UpdateSocialInput
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
    const existingData = await db.social.findUnique({
      where: { documentId: id },
    });

    if (!existingData) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Sosial şəbəkə tapılmadı",
      };
    }

    const parsedInput = updateSocialSchema.safeParse(input);

    if (!parsedInput.success) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Validation failed",
        errors: formatZodErrors(parsedInput.error),
      };
    }

    const { socialName, socialLink, iconName, status } = parsedInput.data;

    // Check duplicate socialName (exclude current)
    if (socialName && socialName !== existingData.socialName) {
      const duplicateName = await db.social.findUnique({
        where: { socialName },
      });

      if (duplicateName) {
        return {
          success: false,
          error: "Bu adda sosial şəbəkə artıq mövcuddur",
          code: "DUPLICATE",
        };
      }
    }

    // Check duplicate socialLink (exclude current)
    if (socialLink && socialLink !== existingData.socialLink) {
      const duplicateLink = await db.social.findUnique({
        where: { socialLink },
      });

      if (duplicateLink) {
        return {
          success: false,
          error: "Bu link artıq mövcuddur",
          code: "DUPLICATE",
        };
      }
    }

    const updatedData = await db.social.update({
      where: { documentId: id },
      data: {
        ...(socialName && { socialName }),
        ...(socialLink && { socialLink }),
        ...(iconName && { iconName }),
        ...(status && { status }),
      },
    });
    revalidateAll();
    return {
      success: true,
      data: updatedData,
      code: "SUCCESS",
      message: "Sosial şəbəkə uğurla yeniləndi",
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

// DELETE SOCIAL
export async function deleteSocial(id: string): Promise<ActionResult> {
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
    const existingData = await db.social.findUnique({
      where: { documentId: id },
    });

    if (!existingData) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Sosial şəbəkə tapılmadı",
      };
    }

    await db.social.delete({
      where: { documentId: id },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      message: "Sosial şəbəkə uğurla silindi",
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

// TOGGLE STATUS
export async function toggleSocialStatus(id: string): Promise<ActionResult> {
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
    const existingData = await db.social.findUnique({
      where: { documentId: id },
    });

    if (!existingData) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Sosial şəbəkə tapılmadı",
      };
    }

    const newStatus =
      existingData.status === Status.published
        ? Status.draft
        : Status.published;

    const updatedData = await db.social.update({
      where: { documentId: id },
      data: { status: newStatus },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      data: updatedData,
      message: `Status ${
        newStatus === Status.published ? "aktiv" : "deaktiv"
      } edildi`,
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
