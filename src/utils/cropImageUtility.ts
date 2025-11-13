// src/utils/cropImageUtility.ts

import type { PixelCrop } from "react-image-crop";

/**
 * Verilmiş şəkil elementindən və kəsim piksellərindən istifadə edərək
 * yeni bir kəsilmiş şəkil (Blob olaraq) yaradır.
 * @param image - Kəsiləcək olan HTMLImageElement.
 * @param crop - Kəsim sahəsinin piksellərlə ölçüləri və mövqeyi (PixelCrop).
 * @returns Kəsilmiş şəkli ehtiva edən bir Promise<Blob | null>.
 */
export async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<Blob | null> {
  if (crop.width === 0 || crop.height === 0) {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("2D context is not supported.");
    return null;
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    const fileExtension = image.src.split(".").pop()?.toLowerCase();
    const mimeType = fileExtension ? `image/${fileExtension}` : "image/png";
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      0.95
    );
  });
}
