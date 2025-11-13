"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import { CustomLocales, Employee } from "@/src/services/interface";
import {
  useServerQuery,
  useServerQueryById,
} from "@/src/hooks/useServerActions";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import CustomAdminSelect from "../../../../_components/singleSelect";
import {
  UpdateEmployeeInput,
  uptadeEmployeeSchema,
} from "@/src/schema/employee.schema";
import {
  getEmployeeById,
  uptadeEmployee,
} from "@/src/actions/client/employe.actions";
import { getPositionData } from "@/src/actions/client/position.actions";
import { useDropdownOptions } from "@/src/hooks/useDropdownOptions";
import { Switch } from "antd";

export default function SectionUptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { success, error } = useMessageStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const getDataWrapper = async () => {
    const result = await getEmployeeById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result.data as Employee | undefined,
      message: result.message,
      code: result.code,
    };
  };
  const { data: existingData } = useServerQueryById<Employee>(
    `employee`,
    getDataWrapper,
    id,
    { locale }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<UpdateEmployeeInput>({
    resolver: zodResolver(uptadeEmployeeSchema),
    values: {
      title: existingData?.translations?.[0]?.title || "",
      orderNumber: existingData?.orderNumber || undefined,
      emailResponse: existingData?.emailResponse || false,
      email: existingData?.email || "",
      positionId: existingData?.translations?.[0]?.positionId || 0,
      description: existingData?.translations?.[0]?.description || "",
      locale: locale as CustomLocales,
    },
  });
  const description = watch("description");
  const emailResponse = watch("emailResponse");
  const onSubmit = async (data: UpdateEmployeeInput) => {
    startTransition(async () => {
      const result = await uptadeEmployee(id as string, data);

      if (result.success) {
        success("Məlumat uğurla yadda saxlandı!");
        reset();
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
      <section className={"flex flex-col gap-4 mb-2"}>
        <h1 className={"text-2xl font-medium text-[#171717] mb-8"}>
          {locale === "az"
            ? "Azərbaycan dilində daxil  et"
            : locale === "en"
            ? "İngilis dilində daxil et"
            : "Rus dilində daxil et"}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"grid grid-cols-1 gap-3"}
        >
          <div className={"flex flex-col space-y-4"}>
            <FieldBlock>
              <CustomAdminInput
                title="Başlıq"
                placeholder="Başlıq"
                required={true}
                error={errors.title?.message}
                {...register("title")}
              />
              <CustomAdminInput
                title="E-mail ünvanı"
                placeholder="E-mail ünvanı"
                error={errors.email?.message}
                {...register("email")}
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
          <div className={"flex flex-col space-y-4"}>
            <div className={"grid grid-cols-2 gap-4 mt-auto max-w-lg"}>
              <NavigateBtn />
              <SubmitAdminButton
                title={existingData?.translations?.[0]?.title}
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
