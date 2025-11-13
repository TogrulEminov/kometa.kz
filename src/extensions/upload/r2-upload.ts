import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import path from "path";
import { v4 as uuidv4 } from "uuid";

function validateCredentials() {
  const requiredEnvVars = [
    "CF_ENDPOINT",
    "CF_ACCESS_KEY_ID",
    "CF_SECRET_ACCESS_KEY",
    "CF_PUBLIC_ACCESS_URL",
    "CF_BUCKET",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}
function generateOrganizedPath(
  originalKey: string,
  fileType: string,
  apiEndpoint?: string
): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const fileExtension = path.extname(originalKey);
  const fileName = path.basename(originalKey, fileExtension);

  let folderType = "others";
  if (fileType.startsWith("image/")) {
    folderType = "images";
  } else if (fileType.startsWith("video/")) {
    folderType = "videos";
  } else if (fileType.startsWith("audio/")) {
    folderType = "audio";
  } else if (fileType.includes("pdf")) {
    folderType = "documents";
  } else if (
    fileType.includes("model/gltf-binary") ||
    fileType.includes("model/gltf+json")
  ) {
    folderType = "models";
  } else if (
    fileType.includes("application/obj") ||
    fileType.includes("application/fbx") ||
    fileType.includes("application/stl") ||
    fileType.includes("application/octet-stream")
  ) {
    folderType = "models";
  } else {
    folderType = "documents";
  }

  const uniqueId = uuidv4();
  const uniqueFileName = `${uniqueId}_${fileName}`;

  let organizedPath: string;

  if (apiEndpoint) {
    organizedPath = `general/${folderType}/${apiEndpoint}/${year}/${month}/${day}/${uniqueFileName}`;
  } else {
    organizedPath = `${folderType}/${year}/${month}/${day}/${uniqueFileName}`;
  }

  return organizedPath;
}
export async function uploadBufferToR2(
  bucket: string | undefined,
  key: string,
  fileType: string,
  fileBuffer: Buffer,
  apiEndpoint?: string
) {
  try {
    validateCredentials();

    const s3 = new S3Client({
      endpoint: process.env.CF_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CF_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
      },
      region: "auto",
    });

    const organizedKey = generateOrganizedPath(key, fileType, apiEndpoint);

    // R2-yə Yükləmə əməliyyatı
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: bucket,
        Key: organizedKey,
        ContentType: fileType,
        Body: fileBuffer,
        Metadata: {
          originalName: path.basename(key),
          uploadedAt: new Date().toISOString(),
          fileType: fileType,
          folderType: organizedKey.split("/")[0],
          apiEndpoint: apiEndpoint || "unknown",
        },
      },
    });

    await upload.done();

    // Tam URL-i yaratmaq üçün baseUrl-ı təmizləyirik
    const publicBaseUrl = process.env.CF_PUBLIC_ACCESS_URL?.endsWith("/")
      ? process.env.CF_PUBLIC_ACCESS_URL
      : `${process.env.CF_PUBLIC_ACCESS_URL}/`;

    const fullUrl = `${publicBaseUrl}${organizedKey}`;

    // Database-ə qeyd olunacaq relativ yol
    const relativePath = `/${organizedKey}`;

    return {
      fullUrl: fullUrl,
      relativePath: relativePath, // Database üçün: /general/images/...
      fileKey: organizedKey, // R2-dəki unikal açar (general/images/...)
      originalFileName: path.basename(key),
      fileSize: fileBuffer.length,
      mimeType: fileType,
      apiEndpoint: apiEndpoint,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`R2 Upload failed: ${error.message}`);
    }
    throw new Error("Unable to upload file to R2.");
  }
}

// R2-dən silmə funksiyası
export async function deleteObjectFromR2(
  bucket: string | undefined,
  objectUrlOrKey: string // Həm URL, həm də Key qəbul edir
) {
  try {
    validateCredentials();

    const s3 = new S3Client({
      endpoint: process.env.CF_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CF_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
      },
      region: "auto",
    });

    if (!bucket || !objectUrlOrKey) {
      throw new Error("Bucket and object key/URL must be provided.");
    }

    // URL-dan və ya yoldan təmiz 'Key' hissəsini çıxarırıq
    const key = objectUrlOrKey.startsWith("http")
      ? new URL(objectUrlOrKey).pathname.substring(1) // URL-dən yolu alır
      : objectUrlOrKey.startsWith("/") // Relativ yol '/' ilə başlayırsa
      ? objectUrlOrKey.substring(1)
      : objectUrlOrKey; // Əks halda bu, birbaşa Key-dir

    if (!key) {
      throw new Error("Could not extract valid object key from URL/Key.");
    }

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const result = await s3.send(command);

    return { success: true, key, result };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`R2 Object deletion failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during R2 object deletion.");
  }
}
