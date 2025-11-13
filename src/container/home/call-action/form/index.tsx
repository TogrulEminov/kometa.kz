"use client";
import { getService } from "@/src/actions/client/service.actions";
import { createCallAction } from "@/src/actions/ui/form.actions";
import CustomUiInput from "@/src/globalElements/form/input";
import CustomPhoneUI from "@/src/globalElements/form/phone";
import CustomImage from "@/src/globalElements/ImageTag";
import { useServerQuery } from "@/src/hooks/useServerActions";
import {
  CreateCallActionInput,
  createCallActionSchema,
} from "@/src/schema/callaction.schema";
import { CustomLocales, FileType } from "@/src/services/interface";
import { getForCards } from "@/src/utils/getFullimageUrl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import React, { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

export default function CallActionForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const { data: serviceData } = useServerQuery("service", getService, {
    params: {
      page: 1,
      pageSize: 12,
      locale: locale as CustomLocales,
    },
  });
  const [successMessage, setSuccessMessage] = React.useState(false);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreateCallActionInput>({
    resolver: zodResolver(createCallActionSchema),
    defaultValues: {
      category: "",
      fullName: "",
      email: "",
      phone: "",
      typesProduct: "",
      weight: "",
      dimensions: "",
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = async (data: CreateCallActionInput) => {
    const newData = {
      ...data,
      category: selectedCategory,
    };
    startTransition(async () => {
      try {
        const result = await createCallAction(newData);

        if (result?.success) {
          setSuccessMessage(true);
          reset();
          setTimeout(() => setSuccessMessage(false), 8000);
        }
      } catch (error) {
        console.error("Submit error:", error);
      }
    });
  };

  return (
    <div className="w-full">
      {/* Success Message */}
      {successMessage ? (
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl border border-green-100">
          <div className="text-center space-y-6">
            <div className="w-15 lg:w-20 h-15 lg:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {t("callAction.success.title")}
              </h3>
              <p className="text-base lg:text-lg text-gray-600 max-w-md mx-auto">
                {t("callAction.success.description")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Header Info */}
            <div className="bg-gradient-to-br from-ui-4 via-ui-1 to-ui-4 p-8 lg:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    {t("callAction.title")}
                  </h2>
                  <p className="text-slate-300 text-lg">
                    {t("callAction.description")}
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-white font-semibold mb-1">
                        {t("callAction.features.one.title")}
                      </span>
                      <p className="text-slate-300 text-sm">
                        {t("callAction.features.one.description")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-white font-semibold mb-1">
                        {t("callAction.features.two.title")}
                      </strong>
                      <p className="text-slate-300 text-sm">
                        {t("callAction.features.two.description")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-white font-semibold mb-1">
                        {t("callAction.features.three.title")}
                      </strong>
                      <p className="text-slate-300 text-sm">
                        {t("callAction.features.three.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 lg:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Freight Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t("callAction.form.category")}
                    <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Please select a freight type" }}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {serviceData?.data.map((cat) => {
                          const translations = cat?.translations?.[0];
                          const isSelected = field.value === translations.title;
                          return (
                            <label
                              key={translations.title}
                              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? "border-slate-600 bg-slate-50 shadow-md"
                                  : "border-gray-200 bg-white hover:border-slate-300 hover:shadow-sm"
                              }`}
                            >
                              <input
                                type="radio"
                                className="sr-only"
                                value={translations.title}
                                checked={isSelected}
                                onChange={(e) => field.onChange(e.target.value)}
                              />

                              <div
                                className={`transition-colors ${
                                  isSelected
                                    ? "text-slate-700"
                                    : "text-gray-400"
                                }`}
                              >
                                <CustomImage
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 object-contain"
                                  title={translations?.title}
                                  src={getForCards(cat?.iconsUrl as FileType)}
                                />
                              </div>

                              <span
                                className={`text-xs font-semibold text-center ${
                                  isSelected
                                    ? "text-slate-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {translations?.title}
                              </span>

                              {isSelected && (
                                <div className="absolute -top-1 -right-1">
                                  <div className="w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <CustomUiInput
                        title={t("callAction.form.fullName")}
                        placeholder="Togrul Eminov"
                        required
                        error={errors.fullName?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <CustomUiInput
                        title={t("callAction.form.email")}
                        type="email"
                        placeholder="john@company.com"
                        required
                        error={errors.email?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <CustomPhoneUI
                        title={t("callAction.form.phone")}
                        required
                        error={errors.phone?.message}
                        value={field.value}
                        onChange={field.onChange}
                        name="phone"
                      />
                    )}
                  />
                </div>

                {/* Shipment Details */}
                <div className="space-y-4">
                  <Controller
                    name="typesProduct"
                    control={control}
                    render={({ field }) => (
                      <CustomUiInput
                        title={t("callAction.form.typesProduct")}
                        placeholder="Electronics, Textiles, etc."
                        required
                        error={errors.typesProduct?.message}
                        {...field}
                      />
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="weight"
                      control={control}
                      render={({ field }) => (
                        <CustomUiInput
                          title={t("callAction.form.weight")}
                          placeholder="500 kg"
                          required
                          error={errors.weight?.message}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name="dimensions"
                      control={control}
                      render={({ field }) => (
                        <CustomUiInput
                          title={t("callAction.form.dimensions")}
                          placeholder="100×50×30"
                          required
                          error={errors.dimensions?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending || !isDirty}
                  className="w-full group cursor-pointer relative px-6 py-3.5 bg-slate-800 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t("callAction.form.sending")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {t("callAction.form.getOrder")}
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
