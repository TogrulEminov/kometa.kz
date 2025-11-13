"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import { CustomLocales, Features } from "@/src/services/interface";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { upsertFeatures } from "@/src/actions/client/features.actions";
import {
  UpsertFeaturesInput,
  upsertFeaturesSchema,
} from "@/src/schema/features.schema";

interface Props {
  existingData: Features | undefined;
  refetch: () => void;
}

export default function Content({ existingData, refetch }: Props) {
  const searchParams = useSearchParams();
  const { success, error } = useMessageStore();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<UpsertFeaturesInput>({
    resolver: zodResolver(upsertFeaturesSchema),
    mode: "onChange",
    values: {
      title: existingData?.translations?.[0]?.title || "",
      subtitle: existingData?.translations?.[0]?.subtitle || "",
      description: existingData?.translations?.[0]?.description || "",
      locale: locale as CustomLocales,
    },
  });

  const description = watch("description");

  const onSubmit = handleSubmit(async (data: UpsertFeaturesInput) => {
    startTransition(async () => {
      const result = await upsertFeatures(data);

      if (result.success) {
        success("Məlumat uğurla yadda saxlandı!");
        reset();
        router.refresh();
        refetch();
      } else {
        error(result.error || "Məlumat göndərilərkən xəta baş verdi.");
      }
    });
  });

  return (
    <section className="flex flex-col gap-4 mb-2">
      <h1 className="text-2xl font-medium text-[#171717] mb-8">
        {locale === "az"
          ? "Azərbaycan dilində daxil et"
          : locale === "en"
          ? "İngilis dilində daxil et"
          : "Rus dilində daxil et"}
      </h1>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
        <div className="flex flex-col space-y-4">
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
              required={true}
              error={errors.subtitle?.message}
              {...register("subtitle")}
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

        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4 mt-auto max-w-lg">
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
  );
}
