"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import OneImageView from "@/src/app/(dashboard)/manage/_components/imageView/single";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import SingleUploadImage from "@/src/app/(dashboard)/manage/_components/upload/single";
import { Features, FileType, UploadedFileMeta } from "@/src/services/interface";
import { useDeleteData } from "@/src/hooks/useApi";
import { VideoInput, videoSchema } from "@/src/schema/img.schema";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { updateFeaturesVideo } from "@/src/actions/client/features.actions";

interface Props {
  existingData: Features | undefined;
  refetch: () => void;
}

export default function UpdateVideo({ existingData, refetch }: Props) {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [isPending, startTransition] = useTransition();
  const currentPathname = usePathname();
  const SESSION_KEY = `tempFiles_${currentPathname}`;
  const router = useRouter();
  const UPLOADED_PATH_KEY = "latest_uploaded_path";
  const [uploadedFile, setUploadedFile] = useState<UploadedFileMeta>(null);
  const [uploadKey, setUploadKey] = useState(0); // Upload komponenti reset etmək üçün
  const { success, error } = useMessageStore();

  const {
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<VideoInput>({
    resolver: zodResolver(videoSchema),
    values: {
      videoId: String(existingData?.videoUrl?.id || ""),
    },
  });

  const { mutate: deleteFile } = useDeleteData<FileType>({
    invalidateKeys: ["features", `features/${id}`],
  });

  const onSubmit = async (data: VideoInput) => {
    if (!data.videoId || !existingData?.documentId) {
      error("Video yüklənmədi və ya məlumatlar tapılmadı!");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateFeaturesVideo(existingData.documentId, {
          videoId: data.videoId,
        });

        if (result?.success) {
          success(result?.message || "Məlumat uğurla yadda saxlandı!");

          if (existingData?.videoUrl?.id) {
            deleteFile(
              { endpoint: `files/delete-file/${existingData.videoUrl.id}` },
              {
                onSuccess: () => {
                  console.log("Köhnə video uğurla silindi.");
                },
                onError: (error) => {
                  console.error("Köhnə videonu silərkən xəta:", error);
                },
              }
            );
          }

          await refetch();
          setUploadedFile(null);
          setUploadKey((prev) => prev + 1); // Upload komponenti sıfırlamaq üçün

          if (typeof window !== "undefined" && window.sessionStorage) {
            window.sessionStorage.removeItem(SESSION_KEY);
            window.sessionStorage.removeItem(UPLOADED_PATH_KEY);
          }
          router.refresh();
        } else {
          error(result?.error || "Xəta baş verdi!");
        }
      } catch (err) {
        console.error("Update error:", err);
        error("Xəta baş verdi!");
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

    setValue("videoId", fileId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
      <section className={"flex flex-col gap-4 my-4.5"}>
        <h2 className={"text-2xl font-medium text-[#171717] mb-4"}>
          Video dəyişin
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"grid grid-cols-1 gap-4"}
        >
          <OneImageView
            selectedImage={existingData?.videoUrl || null}
            onDeleteSuccess={refetch}
          />

          <FieldBlock title="Video daxil et">
            <SingleUploadImage
              key={uploadKey} // Bu key dəyişəndə komponent tam sıfırlanır
              label="Yükləmək üçün faylı vurun və ya sürükləyin"
              setFile={handleSetUploadedFile}
              file={uploadedFile}
              acceptType="video/mp4,video/webm,video/avi,video/quicktime"
              isImageCropActive={false}
              isParentFormSubmitted={false}
            />
            {errors.videoId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.videoId.message}
              </p>
            )}
          </FieldBlock>

          <div className={"grid grid-cols-2 gap-5 max-w-lg"}>
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
