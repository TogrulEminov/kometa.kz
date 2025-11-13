"use client";
import { useRouter, useSearchParams } from "next/navigation";
import SingleUploadImage from "@/src/app/(dashboard)/manage/_components/upload/single";
import React, { useState, useTransition } from "react";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CreateButton from "@/src/app/(dashboard)/manage/_components/createButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomLocales, UploadedFileMeta } from "@/src/services/interface";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { useForm } from "react-hook-form";
import CustomAdminSelect from "../../_components/singleSelect";
import { useServerQuery } from "@/src/hooks/useServerActions";
import { getPositionData } from "@/src/actions/client/position.actions";
import { useDropdownOptions } from "@/src/hooks/useDropdownOptions";
import {
  CreateEmployeeInput,
  createEmployeeSchema,
} from "@/src/schema/employee.schema";
import { createEmployee } from "@/src/actions/client/employe.actions";
import { Switch } from "antd";

export default function CreateEmployee() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<UploadedFileMeta>(null);

  const { success, error } = useMessageStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      title: "",
      description: "",
      orderNumber: 0,
      positionId: undefined,
      emailResponse: false,
      email: "",
      locale: locale as CustomLocales,
    },
  });
  const description = watch("description");
  const emailResponse = watch("emailResponse");

  const onSubmit = async (data: CreateEmployeeInput) => {
    startTransition(async () => {
      const result = await createEmployee({
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

  const { data: enumsData } = useServerQuery("position", getPositionData, {
    params: {
      pageSize: 10000,
      locale: locale as CustomLocales,
    },
  });

  const enumOptions = useDropdownOptions(
    enumsData?.data?.flatMap((item) =>
      item.translations.map((tr) => ({
        ...tr,
        value: tr.id,
        label: tr.title,
      }))
    ) || [],
    "value",
    "label"
  );

  const handleSwitchChange = (checked: boolean) => {
    setValue("emailResponse", checked, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <h1 className="font-medium text-[#171717] text-3xl mb-8">
          {locale === "az"
            ? "Azərbaycan dilində daxil et"
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
              <label className="flex flex-col gap-2 w-full">
                <span className="text-sm font-medium text-gray-600">
                  Emaillərə cavab verən şəxsdirmi?
                </span>
                <Switch checked={emailResponse} onChange={handleSwitchChange} />
                {errors.emailResponse && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.emailResponse.message}
                  </p>
                )}
              </label>
              <CustomAdminInput
                title="E-mail ünvanı"
                placeholder="E-mail ünvanı"
                error={errors.email?.message}
                {...register("email")}
              />
              <CustomAdminInput
                title="Sıra nömrəsi"
                placeholder="Sıra nömrəsi"
                type="number"
                min={0}
                error={errors.orderNumber?.message}
                {...register("orderNumber", {
                  setValueAs: (v) => {
                    if (v === "" || v === null) return undefined;
                    const num = parseInt(v, 10);
                    return isNaN(num) ? undefined : num;
                  },
                })}
              />

              <CustomAdminSelect
                title="Vəzifəni seç"
                placeholder="Seçin"
                required={true}
                options={enumOptions}
                error={errors.positionId?.message}
                {...register("positionId", { valueAsNumber: true })}
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
            <div className={"grid grid-cols-2 gap-5 max-w-lg"}>
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
