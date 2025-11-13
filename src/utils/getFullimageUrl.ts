import {
  CustomUploadFile,
  DatabaseImageType,
  FileType,
} from "../services/interface";
const CF_PUBLIC_URL = process.env.NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL;
export const getFullImageUrl = (currentFile: CustomUploadFile) => {
  if (!currentFile.url) return "";

  if (currentFile.url.startsWith("blob:")) {
    return currentFile.url;
  }

  const cleanUrl = currentFile.url.startsWith("/")
    ? currentFile.url.slice(1)
    : currentFile.url;

  return `${CF_PUBLIC_URL}${cleanUrl}`;
};

type ImageSource =
  | FileType
  | DatabaseImageType
  | { id: number; publicUrl?: string; fileKey?: string }
  | null
  | undefined;

export const getForCards = (currentFile: ImageSource): string => {
  if (!currentFile || !("id" in currentFile) || !currentFile.id) {
    return "";
  }

  const urlToUse = currentFile.publicUrl || currentFile.fileKey;

  if (!urlToUse) return "";

  // Blob URL
  if (urlToUse.startsWith("blob:")) {
    return urlToUse;
  }

  // Tam URL
  if (urlToUse.startsWith("http://") || urlToUse.startsWith("https://")) {
    return urlToUse;
  }

  // Relative URL-i tam URL-ə çevir
  const cleanUrl = urlToUse.startsWith("/") ? urlToUse.slice(1) : urlToUse;

  return `${CF_PUBLIC_URL}${cleanUrl}`;
};
