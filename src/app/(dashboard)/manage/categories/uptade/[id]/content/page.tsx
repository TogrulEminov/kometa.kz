"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import CustomAdminSelect from "@/src/app/(dashboard)/manage/_components/singleSelect";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import { useSession } from "next-auth/react";
import pageData from "@/src/json/main/page.json";
import { CategoryItem, CustomLocales } from "@/src/services/interface";
import { useServerQueryById } from "@/src/hooks/useServerActions";
import {
  getCategoriesById,
  uptadeCategory,
} from "@/src/actions/client/category.actions";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpdateCategoryInput,
  uptadeCategorySchema,
} from "@/src/schema/category.schema";
type OptionTypes = {
  value: string;
  label: string;
};
export default function CategriesUptadeContent() {
  const params = useParams();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { success, error } = useMessageStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const getCategoryWrapper = async () => {
    const result = await getCategoriesById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result.data as CategoryItem | undefined,
      message: result.message,
      code: result.code,
    };
  };
  const { data: existingData } = useServerQueryById<CategoryItem>(
    `categories`,
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
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(uptadeCategorySchema),
    values: {
      title: existingData?.translations?.[0]?.title || "",
      description: existingData?.translations?.[0]?.description || "",
      slug: existingData?.slug || "",
      metaTitle: existingData?.translations?.[0]?.seo.metaTitle || "",
      metaDescription:
        existingData?.translations?.[0]?.seo.metaDescription || "",
      metaKeywords: existingData?.translations?.[0]?.seo.metaDescription || "",
      locale: locale as CustomLocales,
    },
  });
  const description = watch("description");

  const onSubmit = async (data: UpdateCategoryInput) => {
    startTransition(async () => {
      const result = await uptadeCategory(id as string, {
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
              {Boolean(isSuperAdmin) ? (
                <CustomAdminSelect
                  title="Səhifəni seçin"
                  placeholder="Seçin"
                  required={true}
                  options={pageOptions}
                  error={errors.slug?.message}
                  {...register("slug")}
                />
              ) : null}
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
