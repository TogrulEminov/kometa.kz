"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { usePostData, useDeleteData } from "@/src/hooks/useApi";
import { FileType, UploadedFileMeta } from "@/src/services/interface";
import ReactFancyBox from "@/src/lib/fancybox";
import { usePathname } from "next/navigation";

interface CustomUploadFile {
  type: string;
  uid: string;
  name: string;
  status: "done" | "uploading" | "error" | "removed";
  url?: string;
  originFileObj?: File;
  fileId?: number;
  fileKey?: string;
  size?: number;
}

interface MultiUploadProps {
  files: UploadedFileMeta[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFileMeta[]>>;
  label?: string;
  acceptType?: string;
  maxCount?: number;
  maxSize?: number;
  isParentFormSubmitted?: boolean;
}

const MultiUploadImage: React.FC<MultiUploadProps> = ({
  files,
  setFiles,
  label = "Faylları Yüklə",
  acceptType = "*/*",
  maxCount = 10,
  maxSize = 10,
  isParentFormSubmitted = false,
}) => {
  const [fileList, setFileList] = useState<CustomUploadFile[]>([]);
  const currentPathname = usePathname();

  // Upload queue management
  const uploadQueueRef = useRef<File[]>([]);
  const isUploadingRef = useRef(false);

  const CF_PUBLIC_URL = process.env.NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL;

  const SESSION_KEY = `tempFiles_multi_${currentPathname}`;
  const UPLOADED_PATH_KEY = "latest_uploaded_multi_path";

  const { mutate: uploadFile, isPending: uploadLoading } = usePostData<
    { data: FileType },
    FormData
  >();
  const { mutate: deleteFile, isPending: deleteLoading } =
    useDeleteData<FileType>();

  const updateSessionIds = useCallback(
    (newIds: number[]) => {
      if (typeof window !== "undefined") {
        if (newIds.length === 0) {
          sessionStorage.removeItem(SESSION_KEY);
          sessionStorage.removeItem(UPLOADED_PATH_KEY);
        } else {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(newIds));
          sessionStorage.setItem(UPLOADED_PATH_KEY, currentPathname);
        }
      }
    },
    [SESSION_KEY, UPLOADED_PATH_KEY, currentPathname]
  );

  const processNextUpload = useCallback(() => {
    if (isUploadingRef.current || uploadQueueRef.current.length === 0) {
      return;
    }

    const fileToUpload = uploadQueueRef.current.shift();
    if (!fileToUpload) return;

    isUploadingRef.current = true;

    const tempFile: CustomUploadFile = {
      uid: `rc-upload-${Date.now()}-${Math.random()}-${fileToUpload.name}`,
      name: fileToUpload.name,
      status: "uploading",
      originFileObj: fileToUpload,
      type: fileToUpload.type,
      size: fileToUpload.size,
    };

    setFileList((prev) => [...prev, tempFile]);

    const formData = new FormData();
    formData.append("file", fileToUpload);

    uploadFile(
      { endpoint: "files/upload-file", payload: formData },
      {
        onSuccess: (response) => {
          message.success(`${fileToUpload.name} uğurla yükləndi`);
          const fileData = response.data;
          const newFileId = fileData.fileId;

          // Update session storage
          const currentIds = files
            .map((f) => f?.fileId)
            .filter(Boolean) as number[];
          const newIds = [...currentIds, newFileId];
          updateSessionIds(newIds);

          // Update file list
          setFileList((prev) =>
            prev.map((f) =>
              f.uid === tempFile.uid
                ? {
                    ...f,
                    status: "done",
                    url: fileData.relativePath,
                    fileId: fileData.fileId,
                    fileKey: fileData.fileKey,
                    type: fileData.type || fileToUpload.type,
                  }
                : f
            )
          );

          // Update parent state
          const newFile: UploadedFileMeta = {
            fileId: fileData.fileId,
            fileKey: fileData.fileKey || "",
            type: fileData.type || fileToUpload.type || "unknown",
            publicUrl: fileData.fullUrl || "",
            path: fileData.relativePath || "",
            fullUrl: fileData.fullUrl || "",
          };

          setFiles((prev) => [...prev, newFile]);

          isUploadingRef.current = false;
          processNextUpload();
        },
        onError: (error) => {
          message.error(
            `${fileToUpload.name} yükləmə zamanı xəta baş verdi. ${
              error instanceof Error ? error.message : String(error)
            }`
          );
          setFileList((prev) =>
            prev.map((f) =>
              f.uid === tempFile.uid ? { ...f, status: "error" } : f
            )
          );

          isUploadingRef.current = false;
          processNextUpload();
        },
      }
    );
  }, [uploadFile, setFiles, files, updateSessionIds]);

  const beforeUpload = (file: File) => {
    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
      message.error(`${file.name} faylı ${maxSize}MB limitini aşır.`);
      return false;
    }

    const currentFileCount = fileList.filter(
      (f) => f.status !== "removed"
    ).length;
    const newFilesCount = uploadQueueRef.current.length + 1;

    if (currentFileCount + newFilesCount > maxCount) {
      message.error(`Maksimum ${maxCount} fayl yükləyə bilərsiniz.`);
      return false;
    }

    uploadQueueRef.current.push(file);

    // Start processing if not already uploading
    if (!isUploadingRef.current) {
      processNextUpload();
    }

    return false;
  };

  const handleRemove = async (uploadFile: CustomUploadFile) => {
    if (!uploadFile?.fileId) {
      message.error("Fayl ID tapılmadı, silinmə uğursuz oldu.");
      return false;
    }

    try {
      deleteFile(
        { endpoint: `files/delete-file/${uploadFile.fileId}` },
        {
          onSuccess: () => {
            setFileList((prev) => prev.filter((f) => f.uid !== uploadFile.uid));
            setFiles((prev) =>
              prev.filter((f) => f?.fileId !== uploadFile.fileId)
            );

            // Update session storage
            const newIds = files
              .filter(Boolean)
              .filter((f) => f?.fileId !== uploadFile.fileId)
              .map((f) => f?.fileId as number);
            updateSessionIds(newIds);

            message.success("Fayl uğurla silindi");
          },
          onError: (error) => {
            console.error("Delete API error:", (error as Error).message);
            message.error("Fayl silinərkən xəta baş verdi");
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Delete API error:", (error as Error).message);
      message.error("Fayl silinərkən xəta baş verdi");
      return false;
    }
  };

  const cleanupTempFiles = useCallback(async () => {
    if (typeof window === "undefined" || isParentFormSubmitted) return;

    const pathIds = sessionStorage.getItem(SESSION_KEY);
    const idsToCleanup: number[] = pathIds ? JSON.parse(pathIds) : [];

    if (idsToCleanup.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("fileIds", JSON.stringify(idsToCleanup));
      navigator.sendBeacon("/api/files/cleanup-temp-files", formData);
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(UPLOADED_PATH_KEY);
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }, [isParentFormSubmitted, SESSION_KEY, UPLOADED_PATH_KEY]);

  // Cleanup on beforeunload
  useEffect(() => {
    if (typeof window === "undefined" || isParentFormSubmitted) return;

    window.addEventListener("beforeunload", cleanupTempFiles);

    return () => {
      window.removeEventListener("beforeunload", cleanupTempFiles);
    };
  }, [cleanupTempFiles, isParentFormSubmitted]);

  // Cleanup on pathname change
  useEffect(() => {
    return () => {
      if (typeof window === "undefined" || isParentFormSubmitted) return;

      const uploadedPath = sessionStorage.getItem(UPLOADED_PATH_KEY);
      const sessionIds = sessionStorage.getItem(SESSION_KEY);
      const idsInSession: number[] = sessionIds ? JSON.parse(sessionIds) : [];

      if (
        idsInSession.length > 0 &&
        uploadedPath &&
        uploadedPath !== currentPathname
      ) {
        cleanupTempFiles();
      }
    };
  }, [
    cleanupTempFiles,
    isParentFormSubmitted,
    currentPathname,
    UPLOADED_PATH_KEY,
    SESSION_KEY,
  ]);

  // Reset on parent form submit
  useEffect(() => {
    if (isParentFormSubmitted) {
      setFileList([]);
      uploadQueueRef.current = [];
      isUploadingRef.current = false;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(UPLOADED_PATH_KEY);
      }
    }
  }, [isParentFormSubmitted, SESSION_KEY, UPLOADED_PATH_KEY]);

  const getFullImageUrl = (currentFile: CustomUploadFile) => {
    if (!currentFile.url) return "";

    if (currentFile.url.startsWith("blob:")) {
      return currentFile.url;
    }

    const cleanUrl = currentFile.url.startsWith("/")
      ? currentFile.url.slice(1)
      : currentFile.url;

    return `${CF_PUBLIC_URL}${cleanUrl}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const renderFileList = () => {
    if (fileList.length === 0) return null;

    return (
      <div className="mt-5 flex flex-col gap-2.5">
        {fileList.map((currentFile) => {
          const isImage =
            currentFile.type?.startsWith("image/") ||
            currentFile.url?.match(/\.(jpe?g|png|gif|webp|svg)$/i);

          const fullImageUrl = getFullImageUrl(currentFile);

          return (
            <div
              key={currentFile.uid}
              className="p-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {isImage && currentFile.url ? (
                  <img
                    src={fullImageUrl}
                    alt={currentFile.name}
                    className="w-12 h-12 object-cover rounded-md border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-md border border-blue-200">
                    <InboxOutlined className="text-xl text-blue-500" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {currentFile.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {currentFile.status === "uploading" && "Yüklənir..."}
                    {currentFile.status === "done" && (
                      <>
                        Uğurla yükləndi
                        {currentFile.size &&
                          ` • ${formatFileSize(currentFile.size)}`}
                      </>
                    )}
                    {currentFile.status === "error" && (
                      <span className="text-red-500">Xəta baş verdi</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                {currentFile.status === "uploading" && (
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                )}

                {currentFile.status === "done" && (
                  <>
                    {isImage ? (
                      <ReactFancyBox>
                        <a
                          href={fullImageUrl}
                          data-fancybox="multi-gallery"
                          className="px-3 py-1.5 border border-gray-300 rounded bg-white cursor-pointer text-xs text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-all no-underline"
                        >
                          Bax
                        </a>
                      </ReactFancyBox>
                    ) : (
                      <a
                        href={fullImageUrl}
                        download={currentFile.name}
                        className="px-3 py-1.5 border border-gray-300 rounded bg-white cursor-pointer text-xs text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-all no-underline"
                      >
                        Yüklə
                      </a>
                    )}
                    <button
                      onClick={() => handleRemove(currentFile)}
                      disabled={deleteLoading}
                      type="button"
                      className="px-3 py-1.5 border border-red-500 rounded bg-white cursor-pointer text-xs text-red-500 hover:bg-red-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Sil
                    </button>
                  </>
                )}

                {currentFile.status === "error" && (
                  <button
                    onClick={() => handleRemove(currentFile)}
                    type="button"
                    className="px-3 py-1.5 border border-red-500 rounded bg-white cursor-pointer text-xs text-red-500 hover:bg-red-50 transition-all"
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const DraggerComponent = (Upload as any).Dragger || Upload;

  const uploadProps = {
    name: "file",
    multiple: true,
    fileList: [],
    beforeUpload: beforeUpload,
    maxCount: maxCount,
    showUploadList: false,
    disabled: uploadLoading || deleteLoading,
    accept: acceptType,
  };

  return (
    <div className="w-full relative">
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        :global(.ant-upload.ant-upload-drag) {
          position: relative !important;
          width: 100% !important;
          height: auto !important;
          border: 1px dashed #d9d9d9 !important;
          border-radius: 8px !important;
          background-color: #fafafa !important;
          transition: border-color 0.3s !important;
        }

        :global(.ant-upload.ant-upload-drag:hover) {
          border-color: #1890ff !important;
        }

        :global(.ant-upload.ant-upload-drag .ant-upload-btn) {
          position: relative !important;
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          padding: 32px 16px !important;
        }

        :global(.ant-upload-drag-container) {
          position: relative !important;
          display: block !important;
        }
      `}</style>

      <DraggerComponent {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 48, color: "#1890ff" }} />
        </p>
        <p className="ant-upload-text">{label}</p>
        <p className="ant-upload-hint">
          Maksimum {maxCount} fayl, hər biri {maxSize}MB-dan kiçik olmalıdır.
        </p>
        {fileList.length > 0 && (
          <p className="ant-upload-hint mt-2 font-medium">
            Hazırda {fileList.filter((f) => f.status === "done").length} fayl
            yüklənib
            {uploadQueueRef.current.length > 0 &&
              ` (${uploadQueueRef.current.length} növbədə)`}
          </p>
        )}
      </DraggerComponent>

      {renderFileList()}
    </div>
  );
};

export default React.memo(MultiUploadImage);
