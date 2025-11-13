// app/api/cleanup-temp-files/route.ts
import { NextRequest } from "next/server";
import deleteImageService from "@/src/extensions/upload/delete-image";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData(); // Componentdən gələn `fileIds` JSON stringini alırıq
    const fileIdsString = formData.get("fileIds") as string;

    if (!fileIdsString) {
      return Response.json({ success: true });
    }

    const fileIds: number[] = JSON.parse(fileIdsString);

    if (fileIds.length === 0) {
      return Response.json({ success: true });
    } // Database-də və R2-də silmə

    const result = await deleteImageService.deleteFilesByIds({
      fileIds: fileIds,
    });

    return Response.json({
      success: true,
      deletedCount: fileIds.length,
    });
  } catch (error) {
    console.error("Batch temp files cleanup error:", error);
    return Response.json({ success: true }); // Xəta olsa belə, səhifə bağlanmasına icazə ver
  }
}
