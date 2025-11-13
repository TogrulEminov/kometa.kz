"use client";
import React, { useState } from "react";
import ReactFancyBox from "@/src/lib/fancybox";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import CustomImage from "@/src/globalElements/ImageTag";
import { FileType } from "@/src/services/interface";
import { useDeleteData } from "@/src/hooks/useApi";
import { message } from "antd";
import { getForCards } from "@/src/utils/getFullimageUrl";

interface MultiImageViewProps {
  selectedImages: FileType[];
  onDeleteSuccess?: () => void;
}

const MultiImageView: React.FC<MultiImageViewProps> = ({
  selectedImages,
  onDeleteSuccess,
}) => {
  // ✅ Hər şəkil üçün ayrıca loading state
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const { mutate: deleteFile } = useDeleteData<FileType>();

  const handleRemove = (id: number) => {
    if (!id) return;

    // ✅ Bu ID-ni deletingIds set-inə əlavə et
    setDeletingIds((prev) => new Set(prev).add(id));

    deleteFile(
      {
        endpoint: `files/delete-file/${id}`,
      },
      {
        onSuccess: () => {
          message.success("Şəkil uğurla silindi.");
          // ✅ Uğurlu silmədən sonra ID-ni çıxar
          setDeletingIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
          onDeleteSuccess?.();
        },
        onError: (error) => {
          console.error("Delete API error:", (error as Error).message);
          message.error("Fayl silinərkən xəta baş verdi");
          // ✅ Xəta baş verdikdə də ID-ni çıxar
          setDeletingIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        },
      }
    );
  };

  if (!selectedImages?.length) {
    return (
      <div className="flex justify-center items-center h-48 bg-gray-200 text-gray-800 text-lg font-bold rounded-lg shadow-md hover:bg-gray-300 cursor-pointer no-image">
        🚫 Göstəriləcək şəkil yoxdur
      </div>
    );
  }

  return (
    <ReactFancyBox>
      <FieldBlock title="Əvvəlki şəkillər">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {selectedImages?.map((img, idx) => {
            // ✅ Bu şəklin silinmə vəziyyətini yoxla
            const isDeleting = deletingIds.has(Number(img.id));

            return (
              <div key={idx} className="relative">
                <CustomImage
                  src={getForCards(img as FileType)}
                  width={300}
                  height={96}
                  title={`img-${idx}`}
                  className="w-full h-72 object-cover rounded-md"
                />
                <div className="flex items-center gap-x-4 top-2 right-2 absolute z-[2]">
                  <button
                    disabled={isDeleting}
                    type="button"
                    aria-label={`Delete img-${img.id}`}
                    onClick={() => handleRemove(Number(img.id))}
                    className="min-w-9 h-9 cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed px-4 rounded-md bg-red-500 text-white flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.1)] transition-all hover:bg-red-600"
                  >
                    {isDeleting ? "Silinir..." : "Sil"}
                  </button>

                  <a
                    href={getForCards(img as FileType)}
                    data-fancybox="gallery-multi"
                    className="min-w-9 h-9 px-4 rounded-md bg-white flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-gray-100 transition-all"
                  >
                    Önizləmə
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </FieldBlock>
    </ReactFancyBox>
  );
};

export default React.memo(MultiImageView);
