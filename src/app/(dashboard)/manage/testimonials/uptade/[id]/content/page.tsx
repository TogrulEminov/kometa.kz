"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import { CustomLocales, TestimonialsItem } from "@/src/services/interface";
import { useServerQueryById } from "@/src/hooks/useServerActions";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  getTestimonialsById,
  uptadeTestimonials,
} from "@/src/actions/client/testimonials.actions";
import {
  UpdateTestimonialsInput,
  uptadeTestimonialsSchema,
} from "@/src/schema/testimonials.schema";

export default function TestimonialsUptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { success, error } = useMessageStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const getCategoryWrapper = async () => {
    const result = await getTestimonialsById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result.data as TestimonialsItem | undefined,
      message: result.message,
      code: result.code,
    };
  };

  const { data: existingData } = useServerQueryById<TestimonialsItem>(
    `testimaonials`,
    getCategoryWrapper,
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
  } = useForm<UpdateTestimonialsInput>({
    resolver: zodResolver(uptadeTestimonialsSchema),
    values: {
      title: existingData?.translations?.[0]?.title || "",
      rate: Number(existingData?.rate) || 1,
      nameSurname: existingData?.translations?.[0]?.nameSurname || "",
      company: existingData?.company || "",
      description: existingData?.translations?.[0]?.description || "",
      locale: locale as CustomLocales,
    },
  });
  const description = watch("description");

  const onSubmit = async (data: UpdateTestimonialsInput) => {
    startTransition(async () => {
      const result = await uptadeTestimonials(id as string, {
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
                title="Ad Soyad"
                placeholder="Ad Soyad"
                required={true}
                error={errors.nameSurname?.message}
                {...register("nameSurname")}
              />
              <CustomAdminInput
                title="Təmsil etdiyi şirkət"
                placeholder="Təmsil etdiyi şirkət"
                required={true}
                error={errors.company?.message}
                {...register("company")}
              />
              <CustomAdminInput
                title="Ulduz (1-5 arası)"
                placeholder="Ulduz (1-5 arası)"
                type="number"
                min={1}
                max={5}
                step={0.5}
                required={true}
                error={errors.rate?.message}
                {...register("rate", { valueAsNumber: true })}
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
