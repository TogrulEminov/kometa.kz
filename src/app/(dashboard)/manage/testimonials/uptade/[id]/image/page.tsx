"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { message } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import OneImageView from "@/src/app/(dashboard)/manage/_components/imageView/single";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import SingleUploadImage from "@/src/app/(dashboard)/manage/_components/upload/single";
import {
  FileType,
  TestimonialsItem,
  UploadedFileMeta,
} from "@/src/services/interface";
import { useDeleteData } from "@/src/hooks/useApi";
import { useServerQueryById } from "@/src/hooks/useServerActions";
import { z } from "zod";
import { useState } from "react";
import { imgSchema } from "@/src/schema/img.schema";
import {
  getTestimonialsById,
  uptadeTestimonialsImage,
} from "@/src/actions/client/testimonials.actions";

type UpdateTestimonialsImageInput = z.infer<typeof imgSchema>;

export default function TestimonialsUpdateImagePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [isPending, startTransition] = useTransition();
  const currentPathname = usePathname();
  const SESSION_KEY = `tempFiles_${currentPathname}`;
  const router = useRouter();
  const UPLOADED_PATH_KEY = "latest_uploaded_path";
  const [uploadedFile, setUploadedFile] = useState<UploadedFileMeta>(null);

  const getCategoryWrapper = async () => {
    const result = await getTestimonialsById({
      locale: "az",
      id: id as string,
    });

    return {
      data: result.data as TestimonialsItem | undefined,
      message: result.message,
      code: result.code,
    };
  };

  const { data: existingData, refetch } = useServerQueryById<TestimonialsItem>(
    `testimonials`,
    getCategoryWrapper,
    id,
    { locale: "az" }
  );

  const {
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UpdateTestimonialsImageInput>({
    resolver: zodResolver(imgSchema),
    values: {
      imageId: String(existingData?.imageUrl?.id || ""),
    },
  });

  const { mutate: deleteFile } = useDeleteData<FileType>({
    invalidateKeys: ["advantages", `advantages/${id}`],
  });

  const onSubmit = async (data: UpdateTestimonialsImageInput) => {
    if (!data.imageId || !existingData?.documentId) {
      message.error("Şəkil yüklənmədi və ya kategori məlumatları tapılmadı!");
      return;
    }

    startTransition(async () => {
      try {
        const result = await uptadeTestimonialsImage(existingData.documentId, {
          imageId: data.imageId,
        });

        if (result?.success) {
          message.success("Məlumat uğurla yadda saxlandı!");

          if (existingData?.imageUrl?.id) {
            deleteFile(
              { endpoint: `files/delete-file/${existingData.imageUrl.id}` },
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

    setValue("imageId", fileId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-4.5"}>
        <h1 className={"text-2xl font-medium text-[#171717] mb-8"}>
          Şəkili dəyişin
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"grid grid-cols-1 gap-2"}
        >
          <OneImageView
            selectedImage={existingData?.imageUrl || null}
            onDeleteSuccess={refetch}
          />

          <FieldBlock title="Şəkili daxil et">
            <SingleUploadImage
              label="Yükləmək üçün faylı vurun və ya sürükləyin"
              setFile={handleSetUploadedFile}
              file={uploadedFile}
              isImageCropActive={true}
              isParentFormSubmitted={false}
            />
            {errors.imageId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.imageId.message}
              </p>
            )}
          </FieldBlock>

          <div className={"grid grid-cols-2 gap-5"}>
            <NavigateBtn />
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
