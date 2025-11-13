"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import CustomAdminSelect from "@/src/app/(dashboard)/manage/_components/singleSelect";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import SingleUploadImage from "@/src/app/(dashboard)/manage/_components/upload/single";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CreateButton from "@/src/app/(dashboard)/manage/_components/createButton";
import pageData from "@/src/json/main/page.json";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomLocales, UploadedFileMeta } from "@/src/services/interface";
import {
  CreateCategoryInput,
  createCategorySchema,
} from "@/src/schema/category.schema";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { createCategory } from "@/src/actions/client/category.actions";
import { useForm } from "react-hook-form";

type OptionTypes = {
  value: string;
  label: string;
};

export default function CreateCategories() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();
  const { success, error } = useMessageStore();
  const [isPending, startTransition] = useTransition();
  const [uploadedFile, setUploadedFile] = useState<UploadedFileMeta>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      imageId: "",
      locale: locale as CustomLocales,
    },
  });
  const description = watch("description");

  const onSubmit = async (data: CreateCategoryInput) => {
    startTransition(async () => {
      const result = await createCategory({
        ...data,
        imageId: uploadedFile?.fileId?.toString() || "",
      });

      if (result.success) {
        success("Məlumat uğurla yadda saxlandı!");

        reset();
        setUploadedFile(null);

        if (typeof window !== "undefined" && window.sessionStorage) {
          const currentPathname = window.location.pathname;
          window.sessionStorage.removeItem(`tempFiles_${currentPathname}`);
          window.sessionStorage.removeItem("latest_uploaded_path");
        }

        router.back();
        router.refresh();
      } else {
        error(result.error || "Məlumat göndərilərkən xəta baş verdi.");
      }
    });
  };

  const pageOptions: OptionTypes[] =
    pageData?.categories.map((item) => ({
      value: item.value,
      label: item.label,
    })) || [];

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <h1 className="font-medium text-[#171717] text-3xl mb-8">
          {locale === "az"
            ? "Azərbaycan dilində daxil  et"
            : locale === "en"
            ? "İngilis dilində daxil et"
            : "Rus dilində daxil et"}
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"grid grid-cols-1 gap-5"}
        >
          <div className={"flex flex-col space-y-5"}>
            <FieldBlock>
              <CustomAdminInput
                title="Başlıq"
                placeholder="Başlıq"
                required={true}
                error={errors.title?.message}
                {...register("title")}
              />
              <CustomAdminSelect
                title="Səhifəni seçin"
                placeholder="Seçin"
                required={true}
                options={pageOptions}
                error={errors.slug?.message}
                {...register("slug")}
              />
              <CustomAdminEditor
                title="Qısa məlumat"
                value={description}
                onChange={(value) =>
                  setValue("description", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={errors.description?.message}
              />
            </FieldBlock>
          </div>
          <div className={"flex flex-col space-y-5"}>
            <FieldBlock title="SEO məlumatları">
              <CustomAdminInput
                title="Meta Başlıq"
                placeholder="Meta Başlıq"
                error={errors.metaTitle?.message}
                {...register("metaTitle")}
              />
              <CustomAdminInput
                title="Meta məlumat"
                placeholder="Meta məlumat"
                error={errors.metaDescription?.message}
                {...register("metaDescription")}
              />
              <CustomAdminInput
                title="Meta açar sözlər"
                placeholder="Meta açar sözlər"
                error={errors.metaKeywords?.message}
                {...register("metaKeywords")}
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
                isParentFormSubmitted={false}
              />
            </FieldBlock>
            <div className={"grid grid-cols-2 gap-5"}>
              <NavigateBtn />
              <CreateButton
                isLoading={isPending}
                disabled={!isDirty || isPending}
              />
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
