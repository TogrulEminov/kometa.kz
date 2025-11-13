// delete-image.ts
import { db } from "@/src/lib/admin/prismaClient";
import * as r2UploadService from "./r2-upload";

const deleteImageService = {
  async deleteFilesByIds({
    fileId,
    fileIds,
  }: {
    fileId?: number;
    fileIds?: any[];
  }) {
    const deletedResults: Array<{
      id: number;
      success: boolean;
      error?: string;
    }> = [];

    try {
      let idsToProcess: number[] = [];

      // Proses olunacaq ID-ləri müəyyən edirik
      if (fileIds && Array.isArray(fileIds) && fileIds.length > 0) {
        idsToProcess = fileIds;
      } else if (fileId) {
        idsToProcess.push(fileId);
      } else {
        return {
          success: false,
          error: "No file IDs provided for deletion.",
          deletedFiles: deletedResults,
        };
      }

      for (const id of idsToProcess) {
        // 1. Database-dən metadata almaq
        const file = await db.file.findUnique({ where: { id: id } });

        if (!file) {
          // Fayl database-də yoxdursa, uğurlu hesab edib növbəti ID-yə keçirik
          deletedResults.push({
            id: id,
            success: true,
            error: "File record not found in DB (already deleted).",
          });
          continue;
        }

        try {
          // 2. Cloudflare R2-dən Silmək
          await r2UploadService.deleteObjectFromR2(
            process.env.CF_BUCKET,
            file.fileKey // Faylın R2-dəki unikal açarı (Key)
          );

          // 3. Prisma Database-dən Qeydi Silmək
          await db.file.delete({ where: { id: id } });

          deletedResults.push({ id: id, success: true });
        } catch (deleteError) {
          const errorMessage = (deleteError as Error).message;
          console.error(
            `Failed to delete file ID ${id} (Key: ${file.fileKey}):`,
            errorMessage
          );
          deletedResults.push({
            id: id,
            success: false,
            error: `Failed to delete: ${errorMessage}`,
          });
        }
      }

      const allSuccessful = deletedResults.every((res) => res.success);

      return {
        success: allSuccessful,
        deletedFiles: deletedResults,
        error: allSuccessful
          ? undefined
          : "One or more files failed to delete.",
      };
    } catch (mainError) {
      const errorMessage = (mainError as Error).message;
      console.error("Overall file deletion process failed:", errorMessage);
      return {
        success: false,
        error: errorMessage,
        deletedFiles: deletedResults,
      };
    }
  },
};

export default deleteImageService;
