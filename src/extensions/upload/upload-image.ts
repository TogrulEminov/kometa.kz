import { v4 as uuidv4 } from "uuid";
import * as r2UploadService from "./r2-upload";
import sharp from "sharp";
import path from "path";

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function uploadImage(file: File, apiEndpoint?: string) {
  try {
    const fileMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
      "video/mp4",
      // Model/3D fayl tipləri
      "model/gltf-binary",
      "application/octet-stream",
      "model/gltf+json",
      "application/obj",
      "application/fbx",
      "application/stl",
    ];

    if (!fileMimeTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    let processedBuffer: Buffer = fileBuffer;
    let finalMimeType: string = file.type;
    let finalFileName: string = file.name;

    if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      const image = sharp(fileBuffer);

      try {
        processedBuffer = await image.webp({ lossless: true }).toBuffer();

        finalMimeType = "image/webp";
        finalFileName = `${path.parse(file.name).name}.webp`;
      } catch (sharpError) {
        console.warn(
          `Sharp processing failed for ${file.name}. Using original file type.`,
          sharpError
        );
      }
    }
    const uniqueFileName = `${uuidv4()}-${finalFileName}`;

    const r2Result = await r2UploadService.uploadBufferToR2(
      process.env.CF_BUCKET,
      uniqueFileName,
      finalMimeType,
      processedBuffer,
      apiEndpoint
    );

    if (!r2Result) {
      throw new Error("File upload error: No result from R2 service.");
    }

    return r2Result;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Image upload process failed:", errorMessage);
    throw error;
  }
}
