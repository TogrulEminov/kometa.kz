"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import SingleUploadImage from "@/src/app/(dashboard)/manage/_components/upload/single";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CreateButton from "@/src/app/(dashboard)/manage/_components/createButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomLocales, UploadedFileMeta } from "@/src/services/interface";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { useForm } from "react-hook-form";
import MultiUploadImage from "@/src/app/(dashboard)/manage/_components/upload/multi";
import {
  CreatePhotoesInput,
  createPhotoesSchema,
} from "@/src/schema/photo-gallery.schema";
import { createGallery } from "@/src/actions/client/gallery.actions";

export default function CreatePhotoGallery() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();
  const { success, error } = useMessageStore();
  const [isPending, startTransition] = useTransition();
  const [galleryFiles, setGalleryFiles] = useState<UploadedFileMeta[]>([]);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileMeta | null>(
    null
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm<CreatePhotoesInput>({
    resolver: zodResolver(createPhotoesSchema),
    defaultValues: {
      title: "",
      imageId: "",
      galleryIds: [],
      locale: locale as CustomLocales,
    },
  });

  const onSubmit = async (data: CreatePhotoesInput) => {
    startTransition(async () => {
      const result = await createGallery({
        ...data,
        imageId: uploadedFile?.fileId?.toString() || "",
        galleryIds: galleryFiles.map((file) => file?.fileId?.toString() || ""),
      });

      if (result.success) {
        success("Məlumat uğurla yadda saxlandı!");
        setIsSuccess(true);
        reset();
        setUploadedFile(null);
        setGalleryFiles([]);

        if (typeof window !== "undefined" && window.sessionStorage) {
          const currentPathname = window.location.pathname;
          window.sessionStorage.removeItem(`tempFiles_${currentPathname}`);
          window.sessionStorage.removeItem(
            `tempFiles_multi_${currentPathname}`
          );
          window.sessionStorage.removeItem("latest_uploaded_path");
          window.sessionStorage.removeItem("latest_uploaded_multi_path");
        }

        router.back();
        router.refresh();
      } else {
        error(result.error || "Məlumat göndərilərkən xəta baş verdi.");
      }
    });
  };

  return (
    <section className="flex flex-col gap-4 mb-5">
      <h1 className="font-medium text-[#171717] text-3xl mb-8">
        {locale === "az"
          ? "Azərbaycan dilində daxil et"
          : locale === "en"
          ? "İngilis dilində daxil et"
          : "Rus dilində daxil et"}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5"
      >
        <div className="flex flex-col space-y-5">
          <FieldBlock>
            <CustomAdminInput
              title="Başlıq"
              placeholder="Başlıq"
              required={true}
              error={errors.title?.message}
              {...register("title")}
            />
          </FieldBlock>

          <FieldBlock title="Əsas şəkili daxil et">
            <SingleUploadImage
              label="Yükləmək üçün faylı vurun və ya sürükləyin"
              setFile={(file) => {
                setUploadedFile(file);

                const fileId =
                  file && typeof file === "object" && "fileId" in file
                    ? file.fileId?.toString()
                    : "";

                setValue("imageId", fileId, {
                  shouldValidate: true,
                });
              }}
              file={uploadedFile}
              isImageCropActive={true}
              isParentFormSubmitted={isSuccess}
            />
            {errors.imageId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.imageId.message}
              </p>
            )}
          </FieldBlock>

          <FieldBlock title="Qalereya şəkillərini daxil et (İstəyə bağlı)">
            <MultiUploadImage
              label="Yükləmək üçün faylları vurun və ya sürükləyin"
              setFiles={setGalleryFiles}
              files={galleryFiles}
              isParentFormSubmitted={isSuccess}
              maxCount={20}
              maxSize={10}
              acceptType="image/*"
            />
          </FieldBlock>

          <div className="grid grid-cols-2 gap-5 max-w-lg">
            <NavigateBtn />
            <CreateButton
              isLoading={isPending}
              disabled={!isDirty || isPending}
            />
          </div>
        </div>
      </form>
    </section>
  );
}
