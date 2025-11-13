"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import pageData from "@/src/json/main/page.json";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CreateButton from "@/src/app/(dashboard)/manage/_components/createButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomLocales } from "@/src/services/interface";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { useForm } from "react-hook-form";
import CustomAdminSelect from "../../_components/singleSelect";
import {
  CreateSectionCtaInput,
  createSectionCtaSchema,
} from "@/src/schema/sectionCta.schema";
import { createSectionCta } from "@/src/actions/client/sectionCta.actions";

type OptionTypes = {
  value: string;
  label: string;
};
export default function CreateSectionCta() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { success, error } = useMessageStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<CreateSectionCtaInput>({
    resolver: zodResolver(createSectionCtaSchema),
    defaultValues: {
      title: "",
      description: "",
      subTitle: "",
      key: "",
      locale: locale as CustomLocales,
    },
  });
  const description = watch("description");

  const onSubmit = async (data: CreateSectionCtaInput) => {
    startTransition(async () => {
      const result = await createSectionCta({
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
          <div className={"flex flex-col space-y-5"}>
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
