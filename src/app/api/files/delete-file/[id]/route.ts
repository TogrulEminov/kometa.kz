import deleteImageService from "@/src/extensions/upload/delete-image";
import { db } from "@/src/lib/admin/prismaClient";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const fileId = (await params).id;

    if (!fileId) {
      return Response.json({ error: "File ID is required" }, { status: 400 });
    }
    let dbFileId: number;

    if (isNaN(Number(fileId))) {
      const [fileName, _] = fileId.split("-");

      const file = await db.file.findFirst({
        where: {
          originalName: {
            contains: fileName,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!file) {
        return Response.json({ error: "File not found" }, { status: 404 });
      }

      dbFileId = file.id;
    } else {
      dbFileId = Number(fileId);
    }

    // Faylı sil
    const result = await deleteImageService.deleteFilesByIds({
      fileId: dbFileId,
    });

    if (result.success) {
      return Response.json({
        success: true,
        message: "File deleted successfully",
      });
    } else {
      return Response.json(
        {
          error: "Delete failed",
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Delete API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return Response.json(
      {
        error: "Delete failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
