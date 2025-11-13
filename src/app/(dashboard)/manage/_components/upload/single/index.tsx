"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { usePostData, useDeleteData } from "@/src/hooks/useApi";
import { FileType, UploadedFileMeta } from "@/src/services/interface";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImg } from "@/src/utils/cropImageUtility";
import ReactFancyBox from "@/src/lib/fancybox";
import { usePathname } from "next/navigation";
interface CustomUploadFile {
  type: any;
  uid: string;
  name: string;
  status: "done" | "uploading" | "error" | "removed";
  url?: string;
  originFileObj?: File;
  fileId?: number;
  fileKey?: string;
}

interface ImageUploadProps {
  file: UploadedFileMeta | null;
  setFile: React.Dispatch<React.SetStateAction<UploadedFileMeta | null>>;
  label?: string;
  acceptType?: string;
  isImageCropActive?: boolean;
  maxSize?: number;
  isParentFormSubmitted?: boolean;
}

const SingleUploadImage: React.FC<ImageUploadProps> = ({
  file,
  setFile,
  label = "Fayl Yüklə",
  acceptType = "*/*",
  isImageCropActive = true,
  isParentFormSubmitted = false,
}) => {
  const [fileList, setFileList] = useState<CustomUploadFile[]>([]);
  const [uploadedFileIds, setUploadedFileIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const currentPathname = usePathname();
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const CF_PUBLIC_URL = process.env.NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL;

  const SESSION_KEY = `tempFiles_${currentPathname}`;
  const UPLOADED_PATH_KEY = "latest_uploaded_path";

  const { mutate: uploadFile, isPending: uploadLoading } = usePostData<
    { data: FileType },
    FormData
  >();
  const { mutate: deleteFile, isPending: deleteLoading } =
    useDeleteData<FileType>();

  const isImageFile = (f: File): boolean => {
    return f?.type?.startsWith("image/") ?? false;
  };

  const uploadFileToServer = useCallback(
    (fileToUpload: File) => {
      if (typeof window !== "undefined" && uploadedFileIds.length > 0) {
        sessionStorage.removeItem(SESSION_KEY);
      }

      const tempFile: CustomUploadFile = {
        uid: `rc-upload-${Date.now()}-${fileToUpload.name}`,
        name: fileToUpload.name,
        status: "uploading",
        originFileObj: fileToUpload,
        type: fileToUpload.type,
      };

      setFileList([tempFile]);

      const formData = new FormData();
      formData.append("file", fileToUpload);

      uploadFile(
        { endpoint: "files/upload-file", payload: formData },
        {
          onSuccess: (response) => {
            message.success("Fayl uğurla yükləndi");
            const fileData = response.data;
            const newFileId = fileData.fileId;

            setUploadedFileIds((prev) => {
              const newIds = [...prev, newFileId];
              if (typeof window !== "undefined") {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(newIds));
                sessionStorage.setItem(UPLOADED_PATH_KEY, currentPathname);
              }
              return newIds;
            });

            setFileList(
              (prev) =>
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
                ) as CustomUploadFile[]
            );
            setFile({
              fileId: fileData.fileId,
              fileKey: fileData.fileKey ?? "",
              type: fileData.type,
              publicUrl: fileData.fullUrl ?? "",
              path: fileData.relativePath,
              fullUrl: fileData.fullUrl,
            });
          },
          onError: (error) => {
            message.error(
              `Fayl yükləmə zamanı xəta baş verdi. ${
                error instanceof Error ? error.message : String(error)
              }`
            );
            setFileList(
              (prev) =>
                prev.map((f) =>
                  f.uid === tempFile.uid ? { ...f, status: "error" } : f
                ) as CustomUploadFile[]
            );
            setFile(null);
          },
        }
      );
    },
    [uploadFile, setFile, SESSION_KEY, currentPathname, uploadedFileIds]
  );

  const beforeUpload = (uploadedFile: File) => {
    if (isImageCropActive && isImageFile(uploadedFile)) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCropSrc(reader.result as string);
        setPendingFile(uploadedFile);
        setIsModalOpen(true);
        document.body.classList.add("no-scroll");
      });
      reader.readAsDataURL(uploadedFile);
      return false;
    } else {
      setFileList([]);
      uploadFileToServer(uploadedFile);
      return false;
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget;
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
    const initialCropOptions = { unit: "%" as const, width: 90 };
    let newCrop;
    if (aspect) {
      newCrop = makeAspectCrop(initialCropOptions, aspect, width, height);
    } else {
      newCrop = { ...initialCropOptions, height: 90 };
    }
    setCrop(centerCrop(newCrop, width, height));
  };

  const handleSaveCrop = async () => {
    if (!completedCrop || !imgRef.current || !pendingFile) return;

    try {
      const blob = await getCroppedImg(imgRef.current, completedCrop);
      if (blob) {
        const fileExtension = pendingFile.name.split(".").pop()?.toLowerCase();
        const mimeType = fileExtension ? `image/${fileExtension}` : "image/png";
        const originalName =
          pendingFile.name.split(".").slice(0, -1).join(".") || "cropped";
        const croppedFile = new File(
          [blob],
          `${originalName}_cropped.${fileExtension}`,
          { type: mimeType }
        );

        closeModal();
        uploadFileToServer(croppedFile);
      }
    } catch (e) {
      console.error(e);
      message.error("Şəkli kəsmək mümkün olmadı.");
    }
  };

  const handleDimensionChange = (
    dimension: "width" | "height",
    value: number
  ) => {
    if (value > 0 && crop && imgRef.current && completedCrop) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      let newWidth = completedCrop.width;
      let newHeight = completedCrop.height;

      if (dimension === "width") {
        newWidth = Math.min(value, naturalWidth);
        if (aspect) newHeight = newWidth / aspect;
      } else {
        newHeight = Math.min(value, naturalHeight);
        if (aspect) newWidth = newHeight * aspect;
      }

      const newPixelCrop: PixelCrop = {
        ...completedCrop,
        width: Math.max(1, newWidth),
        height: Math.max(1, newHeight),
      };

      const newPercentCrop: Crop = {
        unit: "%",
        x: (newPixelCrop.x / naturalWidth) * 100,
        y: (newPixelCrop.y / naturalHeight) * 100,
        width: (newPixelCrop.width / naturalWidth) * 100,
        height: (newPixelCrop.height / naturalHeight) * 100,
      };

      setCompletedCrop(newPixelCrop);
      setCrop(newPercentCrop);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCropSrc(null);
    setPendingFile(null);
    document.body.classList.remove("no-scroll");
    setCrop(undefined);
    setCompletedCrop(undefined);
    setImageDimensions(null);
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const cropOptions = { unit: "%" as const, width: 90 };
      let newCrop;
      if (newAspect) {
        newCrop = makeAspectCrop(cropOptions, newAspect, width, height);
      } else {
        newCrop = { ...cropOptions, height: 90 };
      }
      setCrop(centerCrop(newCrop, width, height));
      setCompletedCrop(undefined);
    }
  };

  const handleRemove = async (uploadFile: any) => {
    if (!uploadFile.fileId) {
      message.error("Fayl ID tapılmadı, silinmə uğursuz oldu.");
      return false;
    }

    try {
      await deleteFile(
        { endpoint: `files/delete-file/${uploadFile.fileId}` },
        {
          onSuccess: () => {
            const removedId = uploadFile.fileId;
            setFile(null);
            setFileList([]);

            setUploadedFileIds((prev) => {
              const newIds = prev.filter((id) => id !== removedId);
              if (typeof window !== "undefined") {
                if (newIds.length === 0) {
                  sessionStorage.removeItem(SESSION_KEY);
                  sessionStorage.removeItem(UPLOADED_PATH_KEY);
                } else {
                  sessionStorage.setItem(SESSION_KEY, JSON.stringify(newIds));
                }
              }
              return newIds;
            });

            message.success("Fayl uğurla silindi");
          },
          onError: (error) => {
            console.error("Delete API error:", (error as Error).message);
            message.error("Fayl silinərkən xəta baş verdi");
            return false;
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

  useEffect(() => {
    if (file === null && fileList.length > 0 && isParentFormSubmitted) {
      setFileList([]);
    }
  }, [file, fileList.length, isParentFormSubmitted]);

  const cleanupTempFiles = useCallback(async () => {
    if (typeof window === "undefined") return;

    const pathIds = sessionStorage.getItem(SESSION_KEY);
    const idsToCleanup: number[] = pathIds ? JSON.parse(pathIds) : [];

    if (idsToCleanup.length === 0 || isParentFormSubmitted) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fileIds", JSON.stringify(idsToCleanup));

      console.log("Cleanup çağırıldı. Silinəcək ID-lər:", idsToCleanup);
      navigator.sendBeacon("/api/files/cleanup-temp-files", formData);

      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(UPLOADED_PATH_KEY);
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }, [isParentFormSubmitted, SESSION_KEY]);

  useEffect(() => {
    if (typeof window === "undefined" || isParentFormSubmitted) {
      return;
    }

    window.addEventListener("beforeunload", cleanupTempFiles);

    return () => {
      window.removeEventListener("beforeunload", cleanupTempFiles);
    };
  }, [cleanupTempFiles, isParentFormSubmitted]);

  useEffect(() => {
    return () => {
      if (typeof window === "undefined" || isParentFormSubmitted) {
        return;
      }

      const uploadedPath = sessionStorage.getItem(UPLOADED_PATH_KEY);

      if (
        uploadedFileIds.length > 0 &&
        uploadedPath &&
        uploadedPath !== currentPathname
      ) {
        console.log(
          `Daxili Naviqasiya (Path Change) Cleanup: ${uploadedPath} -> ${currentPathname}`
        );
        cleanupTempFiles();
      }
    };
  }, [
    cleanupTempFiles,
    uploadedFileIds.length,
    isParentFormSubmitted,
    currentPathname,
    UPLOADED_PATH_KEY,
  ]);

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

  const renderFilePreview = () => {
    const currentFile = fileList[0];
    if (!currentFile) return null;

    const isImage =
      currentFile.type?.startsWith("image/") ||
      currentFile.url?.match(/\.(jpe?g|png|gif|webp|svg)$/i);

    const fullImageUrl = getFullImageUrl(currentFile);

    return (
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: 1,
          }}
        >
          {isImage && currentFile.url ? (
            <img
              src={fullImageUrl}
              alt={currentFile.name}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "6px",
                border: "1px solid #e0e0e0",
              }}
            />
          ) : (
            <div
              style={{
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e6f7ff",
                borderRadius: "6px",
                border: "1px solid #91d5ff",
              }}
            >
              <InboxOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#262626",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentFile.name}
            </div>

            <div
              style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px" }}
            >
              {currentFile.status === "uploading" && "Yüklənir..."}
              {currentFile.status === "done" && "Uğurla yükləndi"}
              {currentFile.status === "error" && (
                <span style={{ color: "#ff4d4f" }}>Xəta baş verdi</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {currentFile.status === "uploading" && (
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #f0f0f0",
                borderTopColor: "#1890ff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          )}

          {currentFile.status === "done" && (
            <>
              {isImage ? (
                <ReactFancyBox>
                  <a
                    href={fullImageUrl}
                    data-fancybox="gallery-1"
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #d9d9d9",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#1890ff",
                      transition: "all 0.2s",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#1890ff";
                      e.currentTarget.style.backgroundColor = "#e6f7ff";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "#d9d9d9";
                      e.currentTarget.style.backgroundColor = "#fff";
                    }}
                  >
                    Önizləmə
                  </a>
                </ReactFancyBox>
              ) : (
                <a
                  href={fullImageUrl}
                  download={currentFile.name}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#1890ff",
                    transition: "all 0.2s",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#1890ff";
                    e.currentTarget.style.backgroundColor = "#e6f7ff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#d9d9d9";
                    e.currentTarget.style.backgroundColor = "#fff";
                  }}
                >
                  Yüklə
                </a>
              )}

              <button
                onClick={() => handleRemove(currentFile)}
                disabled={deleteLoading}
                type="button"
                style={{
                  padding: "6px 12px",
                  border: "1px solid #ff4d4f",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  cursor: deleteLoading ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  color: "#ff4d4f",
                  transition: "all 0.2s",
                  opacity: deleteLoading ? 0.6 : 1,
                }}
                onMouseOver={(e) => {
                  if (!deleteLoading) {
                    e.currentTarget.style.backgroundColor = "#fff1f0";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                }}
              >
                {deleteLoading ? "Silinir..." : "Sil"}
              </button>
            </>
          )}

          {currentFile.status === "error" && (
            <button
              onClick={() => handleRemove(currentFile)}
              type="button"
              style={{
                padding: "6px 12px",
                border: "1px solid #ff4d4f",
                borderRadius: "4px",
                backgroundColor: "#fff",
                cursor: "pointer",
                fontSize: "13px",
                color: "#ff4d4f",
              }}
            >
              Sil
            </button>
          )}
        </div>
      </div>
    );
  };

  const DraggerComponent = (Upload as any).Dragger || Upload;

  const uploadProps = {
    name: "file",
    multiple: false,
    fileList: [],
    beforeUpload: beforeUpload,
    maxCount: 1,
    showUploadList: false,
    disabled: uploadLoading || deleteLoading,
    accept: acceptType,
  };

  const DraggerContent = () => (
    <>
      <p className="ant-upload-drag-icon">
        <InboxOutlined style={{ fontSize: 48, color: "#1890ff" }} />
      </p>
      <p className="ant-upload-text">{label}</p>
    </>
  );

  return (
    <>
      <style>
        {`
    @keyframes spin {
     0% { transform: rotate(0deg); }
     100% { transform: rotate(360deg); }
    }
    `}
      </style>

      <DraggerComponent {...uploadProps}>
        <DraggerContent />
      </DraggerComponent>
      {renderFilePreview()}
      {isModalOpen && cropSrc && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "auto",
              maxWidth: "90vw",
              maxHeight: "90vh",
              background: "#fff",
              overflowY: "auto",
              padding: "20px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f2f5",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
              >
                <img
                  ref={imgRef}
                  src={cropSrc}
                  onLoad={onImageLoad}
                  alt="Kəsiləcək şəkil"
                />
              </ReactCrop>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {imageDimensions && (
                  <p>
                    Orijinal Ölçü:
                    <strong>{imageDimensions.width}px</strong> x
                    <strong>{imageDimensions.height}px</strong>
                  </p>
                )}

                {completedCrop?.width && completedCrop?.height ? (
                  <p>
                    Kəsilmiş Ölçü:
                    <strong>{Math.round(completedCrop.width)}px</strong> x
                    <strong>{Math.round(completedCrop.height)}px</strong>
                  </p>
                ) : (
                  <p style={{ color: "#888" }}>Kəsim sahəsini tənzimləyin...</p>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  <label
                    htmlFor="width-input"
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      fontWeight: "500",
                    }}
                  >
                    En (px)
                  </label>

                  <input
                    id="width-input"
                    type="number"
                    value={completedCrop ? Math.round(completedCrop.width) : 0}
                    onChange={(e) =>
                      handleDimensionChange(
                        "width",
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    style={{
                      width: "80px",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <span style={{ fontSize: "1.2rem", color: "#888" }}>x</span>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  <label
                    htmlFor="height-input"
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      fontWeight: "500",
                    }}
                  >
                    Hündürlük (px)
                  </label>

                  <input
                    id="height-input"
                    type="number"
                    value={completedCrop ? Math.round(completedCrop.height) : 0}
                    onChange={(e) =>
                      handleDimensionChange(
                        "height",
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    style={{
                      width: "80px",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => handleAspectChange(undefined)}
                  type="button"
                  style={{
                    backgroundColor: !aspect ? "#1890ff" : "#f0f0f0",
                    color: !aspect ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Sərbəst
                </button>

                <button
                  onClick={() => handleAspectChange(16 / 9)}
                  type="button"
                  style={{
                    backgroundColor: aspect === 16 / 9 ? "#1890ff" : "#f0f0f0",
                    color: aspect === 16 / 9 ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  16:9
                </button>

                <button
                  onClick={() => handleAspectChange(4 / 3)}
                  type="button"
                  style={{
                    backgroundColor: aspect === 4 / 3 ? "#1890ff" : "#f0f0f0",
                    color: aspect === 4 / 3 ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  4:3
                </button>

                <button
                  onClick={() => handleAspectChange(1 / 1)}
                  type="button"
                  style={{
                    backgroundColor: aspect === 1 / 1 ? "#1890ff" : "#f0f0f0",
                    color: aspect === 1 / 1 ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Kvadrat
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                onClick={closeModal}
                type="button"
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  backgroundColor: "#f1f1f1",
                  color: "#333",
                }}
              >
                Ləğv et
              </button>

              <button
                onClick={handleSaveCrop}
                type="button"
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  backgroundColor: "#007bff",
                  color: "white",
                }}
              >
                Yadda Saxla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(SingleUploadImage);
