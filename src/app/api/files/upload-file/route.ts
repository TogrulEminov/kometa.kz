import { uploadImage } from "@/src/extensions/upload/upload-image";
import { db } from "@/src/lib/admin/prismaClient";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "No file found in request" },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, "temp-upload");
    const newFile = await db.file.create({
      data: {
        fileKey: result.fileKey,
        originalName: result.originalFileName,
        mimeType: result.mimeType,
        fileSize: result.fileSize,
        publicUrl: result.relativePath,
        // entityType: apiEndpoint,
      },
    });

    return Response.json({
      success: true,
      data: {
        fileId: newFile.id,
        relativePath: result.relativePath,
        fullUrl: result.fullUrl,
        fileKey: result.fileKey,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      },
    });
  } catch (error) {
    console.error("Upload API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return Response.json(
      {
        error: "Upload failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
