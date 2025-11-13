"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import { CustomLocales, SectionContent } from "@/src/services/interface";
import { useServerQueryById } from "@/src/hooks/useServerActions";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import pageData from "@/src/json/main/page.json";

import CustomAdminSelect from "../../../../_components/singleSelect";
import {
  getSectionCtaById,
  uptadeSectionCta,
} from "@/src/actions/client/sectionCta.actions";
import {
  UpdateSectionCtaInput,
  uptadeSectionCtaSchema,
} from "@/src/schema/sectionCta.schema";

type OptionTypes = {
  value: string;
  label: string;
};
export default function SectionCtaContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { success, error } = useMessageStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const getDataWrapper = async () => {
    const result = await getSectionCtaById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result.data as SectionContent | undefined,
      message: result.message,
      code: result.code,
    };
  };
  const { data: existingData } = useServerQueryById<SectionContent>(
    `section-cta`,
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
  } = useForm<UpdateSectionCtaInput>({
    resolver: zodResolver(uptadeSectionCtaSchema),
    values: {
      title: existingData?.translations?.[0]?.title || "",
      description: existingData?.translations?.[0]?.description || "",
      subTitle: existingData?.translations?.[0]?.subTitle || "",
      key: existingData?.key || "",
      locale: locale as CustomLocales,
    },
  });
  const description = watch("description");

  const onSubmit = async (data: UpdateSectionCtaInput) => {
    startTransition(async () => {
      const result = await uptadeSectionCta(id as string, {
        ...data,
      });

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
  const pageOptions: OptionTypes[] =
    pageData?.categories.map((item) => ({
      value: item.value,
      label: item.label,
    })) || [];
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
                title="Qısa başlıq"
                placeholder="Qısa başlıq"
                error={errors.subTitle?.message}
                {...register("subTitle")}
              />
              <CustomAdminSelect
                title="Açar sözünü seçin"
                placeholder="Seçin"
                required={true}
                options={pageOptions}
                error={errors.key?.message}
                {...register("key")}
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
            <div className={"grid grid-cols-2 gap-4 mt-auto"}>
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
