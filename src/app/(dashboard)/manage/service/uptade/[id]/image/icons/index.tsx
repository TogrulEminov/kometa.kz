"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { message } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import OneImageView from "@/src/app/(dashboard)/manage/_components/imageView/single";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import SingleUploadImage from "@/src/app/(dashboard)/manage/_components/upload/single";
import { useDeleteData } from "@/src/hooks/useApi";
import { useState } from "react";
import { IconsInput, iconsSchema } from "@/src/schema/img.schema";
import {
  FileType,
  ServicesItem,
  UploadedFileMeta,
} from "@/src/services/interface";
import { updateServicesIconsImage } from "@/src/actions/client/service.actions";
interface Props {
  data: ServicesItem;
  refetch: () => void;
}
export default function ServiceUpdateIcons({
  data: existingData,
  refetch,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const currentPathname = usePathname();
  const SESSION_KEY = `tempFiles_${currentPathname}`;
  const router = useRouter();
  const UPLOADED_PATH_KEY = "latest_uploaded_path";
  const [uploadedFile, setUploadedFile] = useState<UploadedFileMeta>(null);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<IconsInput>({
    resolver: zodResolver(iconsSchema),
    values: {
      iconsId: String(existingData?.iconsUrl?.id || ""),
    },
  });

  const { mutate: deleteFile } = useDeleteData<FileType>({
    invalidateKeys: ["service"],
  });

  const onSubmit = async (data: IconsInput) => {
    if (!data.iconsId || !existingData?.documentId) {
      message.error("Şəkil yüklənmədi və ya kategori məlumatları tapılmadı!");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateServicesIconsImage(existingData.documentId, {
          iconsId: data.iconsId,
        });

        if (result?.success) {
          message.success("Məlumat uğurla yadda saxlandı!");

          if (existingData?.iconsUrl?.id) {
            deleteFile(
              { endpoint: `files/delete-file/${existingData.iconsUrl.id}` },
              {
                onSuccess: () => {
                  console.log("Köhnə şəkil uğurla silindi.");
                },
                onError: (error) => {
                  console.error("Köhnə şəkli silərkən xəta:", error);
                },
              }
            );
          }

          await refetch();
          setUploadedFile(null);
          if (typeof window !== "undefined" && window.sessionStorage) {
            window.sessionStorage.removeItem(SESSION_KEY);
            window.sessionStorage.removeItem(UPLOADED_PATH_KEY);
          }
          router.back();
        } else {
          message.error(result?.error || "Xəta baş verdi!");
        }
      } catch (error) {
        console.error("Update error:", error);
        message.error("Xəta baş verdi!");
      }
    });
  };

  const handleSetUploadedFile = (
    file: UploadedFileMeta | ((prev: UploadedFileMeta) => UploadedFileMeta)
  ) => {
    const newFile = typeof file === "function" ? file(uploadedFile) : file;
    setUploadedFile(newFile);

    const fileId =
      newFile && typeof newFile === "object" && "fileId" in newFile
        ? newFile.fileId?.toString()
        : "";

    setValue("iconsId", fileId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  return (
    <>
      <section className={"flex flex-col gap-4 my-4.5"}>
        <h1 className={"text-2xl font-medium text-[#171717] mb-4"}>
          Ikonu dəyişin
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"grid grid-cols-1 gap-2"}
        >
          <OneImageView
            selectedImage={existingData?.iconsUrl || null}
            onDeleteSuccess={refetch}
          />

          <FieldBlock title="Şəkili daxil et">
            <SingleUploadImage
              label="Yükləmək üçün faylı vurun və ya sürükləyin"
              setFile={handleSetUploadedFile}
              file={uploadedFile}
              isImageCropActive={false}
              isParentFormSubmitted={false}
            />
            {errors.iconsId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.iconsId.message}
              </p>
            )}
          </FieldBlock>

          <div className={"grid grid-cols-2 gap-5 max-w-sm"}>
            <SubmitAdminButton
              title={existingData?.translations?.[0]?.title}
              isLoading={isPending}
              disabled={!isDirty || isPending}
            />
          </div>
        </form>
      </section>
    </>
  );
}
