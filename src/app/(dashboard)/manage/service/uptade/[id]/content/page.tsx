"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import {
  CustomLocales,
  InfoGenericType,
  ServicesItem,
} from "@/src/services/interface";
import { useServerQueryById } from "@/src/hooks/useServerActions";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  getServiceById,
  updateServices,
} from "@/src/actions/client/service.actions";
import {
  UpdateServicesInput,
  updateServicesSchema,
} from "@/src/schema/service.schema";
import { parseJSON } from "@/src/utils/checkSlug";

export default function ServicesUptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { success, error } = useMessageStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const getDataWrapper = async () => {
    const result = await getServiceById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result.data as ServicesItem | undefined,
      message: result.message,
      code: result.code,
    };
  };
  const { data: existingData } = useServerQueryById<ServicesItem>(
    `service`,
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
    control,
    reset,
  } = useForm<UpdateServicesInput>({
    resolver: zodResolver(updateServicesSchema),
    values: {
      orderNumber: Number(existingData?.orderNumber) || 0,
      title: existingData?.translations?.[0]?.title || "",
      description: existingData?.translations?.[0]?.description || "",
      metaTitle: existingData?.translations?.[0]?.seo?.metaTitle || "",
      shortDescription: existingData?.translations?.[0]?.shortDescription || "",
      metaDescription:
        existingData?.translations?.[0]?.seo?.metaDescription || "",
      metaKeywords: existingData?.translations?.[0]?.seo?.metaDescription || "",
      locale: locale as CustomLocales,
      features: parseJSON<InfoGenericType>(
        existingData?.translations?.[0]?.features
      ),
      fags: parseJSON<InfoGenericType>(existingData?.translations?.[0]?.fags),
      advantages: parseJSON<InfoGenericType>(
        existingData?.translations?.[0]?.advantages
      ),
    },
  });
  const description = watch("description");
  const fagsFieldArray = useFieldArray({
    control,
    name: "fags" as any,
  });

  const featuresFieldArray = useFieldArray({
    control,
    name: "features" as any,
  });

  const advantagesFieldArray = useFieldArray({
    control,
    name: "advantages" as any,
  });

  const onSubmit = async (data: UpdateServicesInput) => {
    startTransition(async () => {
      const result = await updateServices(id as string, {
        ...data,
        orderNumber: Number(data.orderNumber),
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
                title="Sıra nömrəsi"
                placeholder="0 - 100"
                required={true}
                type="number"
                min={0}
                error={errors.orderNumber?.message}
                {...register("orderNumber", { valueAsNumber: true })}
              />
              <CustomAdminInput
                title="Qısa məlumat"
                placeholder="Qısa məlumat"
                required={true}
                error={errors.shortDescription?.message}
                {...register("shortDescription")}
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
            {/* Features Section */}
            <FieldBlock title="Xüsusiyyətlər">
              <div className="space-y-3 max-w-sm">
                {featuresFieldArray.fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <div className="flex-1">
                      <CustomAdminInput
                        placeholder={`Xüsusiyyət ${index + 1}`}
                        error={errors.features?.[index]?.title?.message}
                        {...register(`features.${index}.title` as const)}
                      />
                      <label htmlFor="description">
                        <textarea
                          title="Təsvir"
                          id="description"
                          placeholder="Sual təsviri"
                          className={`w-full p-3 bg-white border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed min-h-20 resize-none ${
                            errors.features?.[index]?.description?.message
                              ? "border-red-700"
                              : "border-gray-300"
                          }`}
                          {...register(
                            `features.${index}.description` as const
                          )}
                        />
                        {errors.features?.[index]?.description?.message && (
                          <p>
                            {errors.features?.[index]?.description?.message}
                          </p>
                        )}
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => featuresFieldArray.remove(index)}
                      className="mt-1 px-3 cursor-pointer py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Sil"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    featuresFieldArray.append({ title: "", description: "" })
                  }
                  className="w-full px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Xüsusiyyət əlavə et
                </button>
              </div>
            </FieldBlock>

            {/* Advantages Section */}
            <FieldBlock title="Üstünlüklərimiz">
              <div className="space-y-4 max-w-2xl">
                {advantagesFieldArray.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Üstünlük {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => advantagesFieldArray.remove(index)}
                        className="px-3 py-1.5 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        title="Sil"
                      >
                        Sil
                      </button>
                    </div>

                    <div className="space-y-3">
                      <CustomAdminInput
                        title="Başlıq"
                        placeholder="Üstünlük başlığı"
                        error={errors.advantages?.[index]?.title?.message}
                        {...register(`advantages.${index}.title` as const)}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => advantagesFieldArray.append({ title: "" })}
                  className="w-full px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Üstünlük əlavə et
                </button>
              </div>
            </FieldBlock>
            {/* Fags Section */}
            <FieldBlock title="Tez tez verilən suallar">
              <div className="space-y-4 max-w-2xl">
                {fagsFieldArray.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Sual {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => fagsFieldArray.remove(index)}
                        className="px-3 py-1.5 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        title="Sil"
                      >
                        Sil
                      </button>
                    </div>

                    <div className="space-y-3">
                      <CustomAdminInput
                        title="Başlıq"
                        placeholder="Sual başlığı"
                        error={errors.fags?.[index]?.title?.message}
                        {...register(`fags.${index}.title` as const)}
                      />
                      <label htmlFor="description">
                        <textarea
                          title="Təsvir"
                          id="description"
                          placeholder="Sual təsviri"
                          className={`w-full p-3 bg-white border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed min-h-20 resize-none ${
                            errors.fags?.[index]?.description?.message
                              ? "border-red-700"
                              : "border-gray-300"
                          }`}
                          {...register(`fags.${index}.description` as const)}
                        />
                        {errors.fags?.[index]?.description?.message && (
                          <p>{errors.fags?.[index]?.description?.message}</p>
                        )}
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    fagsFieldArray.append({ title: "", description: "" })
                  }
                  className="w-full px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Sual əlavə et
                </button>
              </div>
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
