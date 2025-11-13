/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useTransition, useState, useEffect } from "react";
import { message } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import MultiUploadImage from "@/src/app/(dashboard)/manage/_components/upload/multi";
import MultiImageView from "@/src/app/(dashboard)/manage/_components/imageView/multi";
import {
  FileType,
  UploadedFileMeta,
  GalleryItem,
} from "@/src/services/interface";
import { useDeleteData } from "@/src/hooks/useApi";
import { useServerQueryById } from "@/src/hooks/useServerActions";
import {
  getGalleryById,
  uptadeGalleryImages,
} from "@/src/actions/client/gallery.actions";
import { GalleryInput, gallerySchema } from "@/src/schema/img.schema";

export default function GalleryUpdateImagePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [isPending, startTransition] = useTransition();
  const currentPathname = usePathname();
  const router = useRouter();

  // Session Storage Keys
  const SESSION_KEY = `tempFiles_${currentPathname}`;
  const MULTI_SESSION_KEY = `tempFiles_multi_${currentPathname}`;
  const UPLOADED_PATH_KEY = "latest_uploaded_path";
  const UPLOADED_MULTI_PATH_KEY = "latest_uploaded_multi_path";

  const [uploadedFile, setUploadedFile] = useState<UploadedFileMeta | null>(
    null
  );
  const [galleryFiles, setGalleryFiles] = useState<UploadedFileMeta[]>([]);

  const getCategoryWrapper = async () => {
    const result = await getGalleryById({
      locale: "az",
      id: id as string,
    });
    return {
      data: result.data as GalleryItem | undefined,
      message: result.message,
      code: result.code,
    };
  };

  const { data: existingData, refetch } = useServerQueryById<GalleryItem>(
    `gallery-admin`,
    getCategoryWrapper,
    id,
    { locale: "az" }
  );

  const {
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm<GalleryInput>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      galleryIds: [],
    },
  });

  useEffect(() => {
    if (existingData?.gallery) {
      const ids = existingData.gallery.map((file) => String(file?.id));

      reset({ galleryIds: ids });
    }
  }, [existingData, reset]);

  useEffect(() => {
    const dbIds = existingData?.gallery?.map((file) => String(file?.id)) || [];
    const newFileIds = galleryFiles.map((file) => String(file?.fileId) || "");
    const combinedIds = [...dbIds, ...newFileIds];

    setValue("galleryIds", combinedIds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [galleryFiles, setValue]);

  const { mutate: deleteFile } = useDeleteData<FileType>({
    invalidateKeys: ["gallery-admin", `gallery-admin/${id}`],
  });

  const onSubmit = async (data: GalleryInput) => {
    if (!existingData?.documentId) {
      message.error("Sənəd ID-si tapılmadı!");
      return;
    }

    startTransition(async () => {
      try {
        const result = await uptadeGalleryImages(existingData.documentId, {
          galleryIds: data.galleryIds,
        });

        if (result?.success) {
          message.success("Məlumat uğurla yadda saxlandı!");

          if (uploadedFile && existingData?.imageUrl?.id) {
            deleteFile(
              { endpoint: `files/delete-file/${existingData.imageUrl.id}` },
              {
                onSuccess: () => {
                  console.log("Köhnə əsas şəkil uğurla silindi.");
                },
                onError: (error) => {
                  console.error("Köhnə əsas şəkli silərkən xəta:", error);
                },
              }
            );
          }

          await refetch();
          setUploadedFile(null);
          setGalleryFiles([]);

          if (typeof window !== "undefined" && window.sessionStorage) {
            window.sessionStorage.removeItem(SESSION_KEY);
            window.sessionStorage.removeItem(MULTI_SESSION_KEY);
            window.sessionStorage.removeItem(UPLOADED_PATH_KEY);
            window.sessionStorage.removeItem(UPLOADED_MULTI_PATH_KEY);
          }

          router.back();
          router.refresh();
        } else {
          message.error(result?.error || "Xəta baş verdi!");
        }
      } catch (error) {
        console.error("Update error:", error);
        message.error("Xəta baş verdi!");
      }
    });
  };

  return (
    <section className="flex flex-col gap-4 mb-4.5">
      <h1 className="text-2xl font-medium text-[#171717] mb-8">
        Qalereya şəkillərini dəyişin
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5"
      >
        <FieldBlock title="Qalereya şəkilləri">
          <MultiImageView
            selectedImages={existingData?.gallery || []}
            onDeleteSuccess={refetch}
          />
          <div className="mt-4">
            <MultiUploadImage
              label="Yeni qalereya şəkilləri əlavə edin"
              setFiles={setGalleryFiles}
              files={galleryFiles}
              isParentFormSubmitted={false}
              maxCount={20}
              maxSize={10}
              acceptType="image/*"
            />
            {errors.galleryIds && (
              <p className="text-red-500 text-sm mt-1">
                {errors.galleryIds.message}
              </p>
            )}
          </div>
        </FieldBlock>

        <div className="grid grid-cols-2 gap-5 max-w-lg">
          <NavigateBtn />
          <SubmitAdminButton
            title={existingData?.translations?.[0]?.title}
            isLoading={isPending}
            disabled={!isDirty || isPending}
          />
        </div>
      </form>
    </section>
  );
}
