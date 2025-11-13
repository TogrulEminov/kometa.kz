"use server";

import { db } from "@/src/lib/admin/prismaClient";
import { Role } from "@/src/generated/prisma";
import deleteImageService from "@/src/extensions/upload/delete-image";
import { checkAuthServerAction } from "@/src/middleware/checkAuthorization";
import { revalidateAll } from "@/src/utils/revalidation";

// ════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════
type SingleActionType = "soft-delete" | "restore" | "hard-delete";
type BatchActionType = "all-delete" | "all-restore";
type ActionType = SingleActionType | BatchActionType;

type ActionResult = {
  success: boolean;
  code: string;
  message?: string;
  error?: string;
  data?: {
    totalAffectedCount: number;
    action: ActionType;
    details?: any;
  };
};

type SelectedItem = {
  model: string;
  documentId: string;
};

// ════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════
const IMAGE_FIELD_CONFIG = {
  singleFields: [
    "image",
    "imageUrl",
    "mainUrl",
    "renderUrl",
    "modelUrl",
    "logo",
    "cover",
    "icon",
    "mainImage",
  ],
  arrayFields: ["gallery", "floors", "images"],
};

const MODEL_MAP: { [key: string]: any } = {
  categories: db.categories,
  "contact-enum": db.contactEnum,
  youtube: db.youtube,
  position: db.position,
  employee: db.employee,
  slider: db.slider,
  advantages: db.advantages,
  blog: db.blog,
  branch: db.branch,
  certificates: db.certificates,
  fag: db.faq,
  partners: db.partners,
  sectionContent: db.sectionContent,
  sectioncta: db.sectionCta,
  service: db.services,
  offices: db.office,
  photoGallery: db.photoGallery,
  statistics: db.statistics,
  testimonials: db.testimonials,
  "work-process": db.workProcess,
};

// ════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════
function collectImageUrls(document: any): string[] {
  const urls: string[] = [];

  for (const field of IMAGE_FIELD_CONFIG.singleFields) {
    if (document[field] && typeof document[field] === "string") {
      urls.push(document[field]);
    }
  }

  for (const field of IMAGE_FIELD_CONFIG.arrayFields) {
    if (document[field] && Array.isArray(document[field])) {
      const validUrls = document[field].filter(
        (url: any): url is string => typeof url === "string" && url.length > 0
      );
      urls.push(...validUrls);
    }
  }

  return urls;
}

async function deleteImagesFromStorage(imageUrls: string[]): Promise<void> {
  if (imageUrls.length === 0) return;

  try {
    await deleteImageService.deleteFilesByIds({ fileIds: imageUrls });
  } catch (error) {
    console.error("Error deleting images from storage:", error);
    // Şəkil silinmə xətası olsa belə davam edirik
  }
}

// ════════════════════════════════════════════════════════════════
// SINGLE ITEM OPERATIONS
// ════════════════════════════════════════════════════════════════

/**
 * Soft Delete - Tək element üçün
 */
export async function softDeleteItem(
  model: string,
  documentId: string
): Promise<ActionResult> {
  const { user, error } = await checkAuthServerAction([
    Role.ADMIN,
    Role.CONTENT_MANAGER,
    Role.SUPER_ADMIN,
  ]);

  if (error || !user) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: error || "Giriş edilməyib",
    };
  }

  try {
    const prismaModel = MODEL_MAP[model];

    if (!prismaModel) {
      return {
        success: false,
        code: "INVALID_MODEL",
        error: "Model tapılmadı",
      };
    }

    const item = await prismaModel.findFirst({
      where: { documentId },
      select: { id: true },
    });

    if (!item) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Element tapılmadı",
      };
    }

    const result = await prismaModel.update({
      where: { id: item.id },
      data: { isDeleted: true },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      message: "Element uğurla silindi",
      data: {
        totalAffectedCount: 1,
        action: "soft-delete",
        details: result,
      },
    };
  } catch (error) {
    console.error("Soft delete error:", error);
    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Element silinərkən xəta baş verdi",
    };
  }
}

/**
 * Restore - Tək element üçün
 */
export async function restoreItem(
  model: string,
  documentId: string
): Promise<ActionResult> {
  const { user, error } = await checkAuthServerAction([
    Role.ADMIN,
    Role.CONTENT_MANAGER,
    Role.SUPER_ADMIN,
  ]);

  if (error || !user) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: error || "Giriş edilməyib",
    };
  }

  try {
    const prismaModel = MODEL_MAP[model];

    if (!prismaModel) {
      return {
        success: false,
        code: "INVALID_MODEL",
        error: "Model tapılmadı",
      };
    }

    const item = await prismaModel.findFirst({
      where: { documentId },
      select: { id: true },
    });

    if (!item) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Element tapılmadı",
      };
    }

    const result = await prismaModel.update({
      where: { id: item.id },
      data: { isDeleted: false },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      message: "Element uğurla bərpa edildi",
      data: {
        totalAffectedCount: 1,
        action: "restore",
        details: result,
      },
    };
  } catch (error) {
    console.error("Restore error:", error);
    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Element bərpa edilərkən xəta baş verdi",
    };
  }
}

/**
 * Hard Delete - Tək element üçün (Database və şəkillər)
 */
export async function hardDeleteItem(
  model: string,
  documentId: string
): Promise<ActionResult> {
  const { user, error } = await checkAuthServerAction([
    Role.ADMIN,
    Role.SUPER_ADMIN,
  ]);

  if (error || !user) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: error || "Giriş edilməyib",
    };
  }

  try {
    const prismaModel = MODEL_MAP[model];

    if (!prismaModel) {
      return {
        success: false,
        code: "INVALID_MODEL",
        error: "Model tapılmadı",
      };
    }

    const document = await prismaModel.findFirst({
      where: { documentId },
    });

    if (!document) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Element tapılmadı",
      };
    }

    // Şəkilləri sil
    const imageUrls = collectImageUrls(document);
    await deleteImagesFromStorage(imageUrls);

    // Database record-u sil
    const result = await prismaModel.delete({
      where: { id: document.id },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      message: "Element tamamilə silindi",
      data: {
        totalAffectedCount: 1,
        action: "hard-delete",
        details: result,
      },
    };
  } catch (error) {
    console.error("Hard delete error:", error);
    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Element silinərkən xəta baş verdi",
    };
  }
}

// ════════════════════════════════════════════════════════════════
// BATCH OPERATIONS
// ════════════════════════════════════════════════════════════════

/**
 * Batch Hard Delete - Çoxlu elementləri tamamilə silmək
 */
export async function batchHardDelete(
  selectedItems: SelectedItem[]
): Promise<ActionResult> {
  const { user, error } = await checkAuthServerAction([
    Role.ADMIN,
    Role.SUPER_ADMIN,
  ]);

  if (error || !user) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: error || "Giriş edilməyib",
    };
  }

  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    return {
      success: false,
      code: "VALIDATION_ERROR",
      error: "Heç bir element seçilməyib",
    };
  }

  try {
    // Model-ə görə qruplaşdır
    const groupedByModel: { [key: string]: string[] } = {};
    for (const item of selectedItems) {
      if (MODEL_MAP[item.model] && item.documentId) {
        if (!groupedByModel[item.model]) {
          groupedByModel[item.model] = [];
        }
        groupedByModel[item.model].push(item.documentId);
      }
    }

    let totalAffectedCount = 0;
    const allDetails: any[] = [];

    for (const modelName in groupedByModel) {
      const documentIds = groupedByModel[modelName];
      const prismaModel = MODEL_MAP[modelName];

      for (const docId of documentIds) {
        try {
          const document = await prismaModel.findFirst({
            where: { documentId: docId },
          });

          if (!document) continue;

          // Şəkilləri sil
          const imageUrls = collectImageUrls(document);
          await deleteImagesFromStorage(imageUrls);

          // Database record-u sil
          const deleteResult = await prismaModel.delete({
            where: { id: document.id },
          });

          if (deleteResult) {
            totalAffectedCount++;
            allDetails.push(deleteResult);
          }
        } catch (error) {
          console.error(
            `Error deleting ${modelName} document ${docId}:`,
            error
          );
          // Xəta baş versə də digər elementləri silməyə davam et
        }
      }
    }
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      message: `${totalAffectedCount} element tamamilə silindi`,
      data: {
        totalAffectedCount,
        action: "all-delete",
        details: allDetails,
      },
    };
  } catch (error) {
    console.error("Batch hard delete error:", error);
    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Elementlər silinərkən xəta baş verdi",
    };
  }
}

/**
 * Batch Restore - Çoxlu elementləri bərpa etmək
 */
export async function batchRestore(
  selectedItems: SelectedItem[]
): Promise<ActionResult> {
  const { user, error } = await checkAuthServerAction([
    Role.ADMIN,
    Role.CONTENT_MANAGER,
    Role.SUPER_ADMIN,
  ]);

  if (error || !user) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: error || "Giriş edilməyib",
    };
  }

  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    return {
      success: false,
      code: "VALIDATION_ERROR",
      error: "Heç bir element seçilməyib",
    };
  }

  try {
    // Model-ə görə qruplaşdır
    const groupedByModel: Record<string, string[]> = {};
    for (const item of selectedItems) {
      if (MODEL_MAP[item.model] && item.documentId) {
        if (!groupedByModel[item.model]) {
          groupedByModel[item.model] = [];
        }
        groupedByModel[item.model].push(item.documentId);
      }
    }

    // ✅ BatchUpdateResult type yaradırıq
    type BatchUpdateResult = { count: number };

    const transactionPromises: Promise<BatchUpdateResult>[] = [];

    for (const modelName in groupedByModel) {
      const prismaModel = MODEL_MAP[modelName];
      const documentIds = groupedByModel[modelName];

      for (const docId of documentIds) {
        const promise = prismaModel
          .updateMany({
            where: { documentId: docId },
            data: { isDeleted: false },
          })
          .catch((error: unknown) => {
            console.error(
              `Error restoring ${modelName} document ${docId}:`,
              error
            );
            return { count: 0 } as BatchUpdateResult;
          });

        transactionPromises.push(promise);
      }
    }

    const results = await Promise.all(transactionPromises);

    let totalAffectedCount = 0;
    const allDetails: BatchUpdateResult[] = [];

    results.forEach((result) => {
      totalAffectedCount += result.count;
      if (result.count > 0) {
        allDetails.push(result);
      }
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      message: `${totalAffectedCount} element bərpa edildi`,
      data: {
        totalAffectedCount,
        action: "all-restore",
        details: allDetails,
      },
    };
  } catch (error) {
    console.error("Batch restore error:", error);
    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Elementlər bərpa edilərkən xəta baş verdi",
    };
  }
}

// ════════════════════════════════════════════════════════════════
// UNIVERSAL ACTION HANDLER
// ════════════════════════════════════════════════════════════════

/**
 * Universal Delete/Restore Handler
 * Həm tək, həm də çoxlu element üçün
 */
export async function deleteAction(
  action: ActionType,
  payload: {
    model?: string;
    documentId?: string;
    selectedItems?: SelectedItem[];
  }
): Promise<ActionResult> {
  // Single item operations
  if (payload.model && payload.documentId) {
    switch (action) {
      case "soft-delete":
        return softDeleteItem(payload.model, payload.documentId);
      case "restore":
        return restoreItem(payload.model, payload.documentId);
      case "hard-delete":
        return hardDeleteItem(payload.model, payload.documentId);
    }
  }

  // Batch operations
  if (payload.selectedItems && payload.selectedItems.length > 0) {
    switch (action) {
      case "all-delete":
        return batchHardDelete(payload.selectedItems);
      case "all-restore":
        return batchRestore(payload.selectedItems);
    }
  }
  revalidateAll();
  return {
    success: false,
    code: "INVALID_PAYLOAD",
    error: "Əməliyyat üçün düzgün məlumat göndərilməyib",
  };
}

/**
 * Model Map-i gətirmək üçün
 */
export async function getAvailableModels(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    return {
      success: true,
      data: Object.keys(MODEL_MAP),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "Model siyahısı əldə edilə bilmədi",
    };
  }
}
