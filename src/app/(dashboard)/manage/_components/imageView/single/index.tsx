"use client";
import React from "react";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import CustomImage from "@/src/globalElements/ImageTag";
import ReactFancyBox from "@/src/lib/fancybox";
import { useDeleteData } from "@/src/hooks/useApi";
import { FileType } from "@/src/services/interface";
import { message } from "antd";
import { getForCards } from "@/src/utils/getFullimageUrl";

interface OneImageViewProps {
  selectedImage: FileType | null;
  onDeleteSuccess?: () => void;
}

const OneImageView: React.FC<OneImageViewProps> = ({
  selectedImage,
  onDeleteSuccess,
}) => {
  const { mutate: deleteFile, isPending: deleteLoading } =
    useDeleteData<FileType>();

  if (selectedImage === null) {
    return (
      <div
        className={
          "flex items-center justify-center h-[200px] bg-[#f2f2f2] text-2xl text-center rounded-lg shadow-[0 4px 6px rgba(0, 0, 0, 0.1)] hover:bg-[#e0e0e0] cursor-pointer noImage"
        }
      >
        Göstəriləcək fayl yoxdur
      </div>
    );
  }

  const handleRemove = () => {
    if (!selectedImage?.id) return;

    deleteFile(
      {
        endpoint: `files/delete-file/${selectedImage?.id}`,
      },
      {
        onSuccess: () => {
          message.success("Fayl uğurla silindi.");
          onDeleteSuccess?.();
        },
        onError: (error) => {
          console.error("Delete API error:", (error as Error).message);
          message.error("Fayl silinərkən xəta baş verdi");
        },
      }
    );
  };

  const fancyUrl = getForCards(selectedImage as FileType);
  const mimeType = selectedImage?.mimeType?.toLowerCase() || "";

  // Fayl tipini müəyyən edirik
  const isImage = mimeType === "image" || mimeType.startsWith("image/");
  const isVideo = mimeType === "video" || mimeType.startsWith("video/");
  const isPDF = mimeType === "pdf" || mimeType.includes("pdf");
  const isDocument = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].some((ext) =>
    mimeType.includes(ext)
  );

  // Fancybox üçün data-type
  const getFancyboxType = () => {
    if (isVideo) return "video";
    if (isPDF) return "iframe";
    return "image";
  };

  // Fayl göstərmə komponenti
  const renderFilePreview = () => {
    // Şəkil
    if (isImage) {
      return (
        <CustomImage
          src={fancyUrl}
          title={selectedImage?.originalName}
          width={160}
          height={300}
          className="w-full max-w-full max-h-80 object-contain h-auto rounded-lg"
        />
      );
    }

    // Video
    if (isVideo) {
      return (
        <video
          src={fancyUrl}
          controls
          className="w-full max-w-full max-h-80 object-contain rounded-lg"
          preload="metadata"
        >
          Brauzeriniz video formatını dəstəkləmir.
        </video>
      );
    }

    // PDF
    if (isPDF) {
      return (
        <div className="w-full h-80 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-4">
          <svg
            className="w-20 h-20 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
          </svg>
          <p className="text-gray-600 font-medium">PDF Sənəd</p>
          <p className="text-sm text-gray-500">{selectedImage?.originalName}</p>
        </div>
      );
    }

    // Sənədlər (Word, Excel, PowerPoint)
    if (isDocument) {
      return (
        <div className="w-full h-80 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-4">
          <svg
            className="w-20 h-20 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
          </svg>
          <p className="text-gray-600 font-medium">Sənəd</p>
          <p className="text-sm text-gray-500">{selectedImage?.originalName}</p>
        </div>
      );
    }

    // Digər fayl tipləri
    return (
      <div className="w-full h-80 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-4">
        <svg
          className="w-20 h-20 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
        </svg>
        <p className="text-gray-600 font-medium">Fayl</p>
        <p className="text-sm text-gray-500">{selectedImage?.originalName}</p>
      </div>
    );
  };

  return (
    <ReactFancyBox>
      <FieldBlock title="Əvvəlki fayl">
        <div className="grid grid-cols-3 gap-2">
          <div className="relative rounded-md overflow-hidden">
            {renderFilePreview()}

            <div className="flex items-center gap-x-4 top-2 right-2 absolute">
              <button
                disabled={deleteLoading}
                type="button"
                onClick={handleRemove}
                className="min-w-9 h-9 cursor-pointer disabled:bg-gray-500 px-4 rounded-md bg-red-500 text-white flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
              >
                {deleteLoading ? "Silinir..." : "Sil"}
              </button>

              <a
                href={fancyUrl}
                data-fancybox="gallery-1"
                data-type={getFancyboxType()}
                target={isPDF || isDocument ? "_blank" : undefined}
                rel={isPDF || isDocument ? "noopener noreferrer" : undefined}
                tabIndex={0}
                className="min-w-9 h-9 px-4 rounded-md bg-white flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
              >
                {isPDF || isDocument ? "Aç" : "Önizləmə"}
              </a>
            </div>
          </div>
        </div>
      </FieldBlock>
    </ReactFancyBox>
  );
};

export default React.memo(OneImageView);
