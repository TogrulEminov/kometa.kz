"use client";
import { useLocale, useTranslations } from "next-intl";
import React, { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomUiInput from "@/src/globalElements/form/input";
import CustomPhoneUI from "@/src/globalElements/form/phone";
import CustomUiSelect from "@/src/globalElements/form/custom-select";
import {
  contactSchema,
  CreateContactInput,
} from "@/src/schema/callaction.schema";
import { createContactUs } from "@/src/actions/ui/form.actions";
import { useServerQuery } from "@/src/hooks/useServerActions";
import { CustomLocales } from "@/src/services/interface";
import { useDropdownOptions } from "@/src/hooks/useDropdownOptions";
import { getContactEnumData } from "@/src/actions/client/contactEnum.actions";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = React.useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const { data: existingData } = useServerQuery(
    "contact-enum",
    getContactEnumData,
    {
      params: {
        page: 1,
        pageSize: 1000,
        locale: locale as CustomLocales,
      },
    }
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreateContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: CreateContactInput) => {
    startTransition(async () => {
      try {
        const result = await createContactUs(data);
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
  const enumOptions = useDropdownOptions(
    existingData?.data?.flatMap((item) =>
      item.translations.map((tr) => ({
        ...tr,
        value: tr.title,
        label: tr.title,
      }))
    ) || [],
    "value",
    "label"
  );
  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="lg:mb-12">
        <div className="hidden lg:flex relative items-center mb-12">
          <div className="w-1/2 pr-8 text-right">
            <h3 className="text-xl font-semibold text-ui-1 mb-2">
              1. {t("contactForm.enterInformation")}
            </h3>
            <p className="text-ui-7">{t("contactForm.addInfo")}</p>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-ui-4 rounded-full flex items-center justify-center z-10">
            <span className="text-white text-sm font-bold">1</span>
          </div>
          <div className="w-1/2 pl-8 space-y-4">
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <CustomUiInput
                  placeholder={t("contactForm.form.fullName")}
                  required
                  error={errors.fullName?.message}
                  {...field}
                  title=""
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CustomUiInput
                  type="email"
                  placeholder={t("contactForm.form.email")}
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
                  placeholder={t("contactForm.form.phone")}
                  required
                  error={errors.phone?.message}
                  value={field.value}
                  onChange={field.onChange}
                  name="phone"
                  title=""
                />
              )}
            />
          </div>
        </div>
        <div className="lg:hidden bg-white rounded-2xl p-4 sm:p-6 border border-ui-2 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-ui-4 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm md:text-base">
                1
              </span>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-ui-1">
                {t("contactForm.enterInformation")}
              </h3>
              <p className="text-sm text-ui-7">{t("contactForm.addInfo")}</p>
            </div>
          </div>
          <div className="space-y-4">
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <CustomUiInput
                  placeholder={t("contactForm.form.fullName")}
                  required
                  error={errors.fullName?.message}
                  {...field}
                  title=""
                />
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CustomUiInput
                    type="email"
                    placeholder="Email"
                    required
                    error={errors.email?.message}
                    {...field}
                    title=""
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <CustomPhoneUI
                    placeholder={t("contactForm.form.phone")}
                    required
                    error={errors.phone?.message}
                    value={field.value}
                    onChange={field.onChange}
                    name="phone"
                    title=""
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block absolute left-1/2 transform -translate-x-0.5 w-px h-full bg-ui-2 top-0 bottom-0 z-0"></div>

      <div className="lg:mb-12">
        <div className="hidden lg:flex relative items-center mb-12">
          <div className="w-1/2 pr-8 space-y-4">
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <textarea
                  rows={4}
                  className={
                    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-ui-4 transition-colors resize-none  border-ui-2"
                  }
                  placeholder={t("contactForm.form.message")}
                  {...field}
                ></textarea>
              )}
            />
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-ui-11 rounded-full flex items-center justify-center z-10">
            <span className="text-white text-sm font-bold">2</span>
          </div>
          <div className="w-1/2 pl-8 text-left">
            <h3 className="text-xl font-semibold text-ui-1 mb-2">
              2. {t("contactForm.writeMessage")}
            </h3>
            <p className="text-ui-7">{t("contactForm.messageContent")}</p>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <CustomUiSelect
                  title={t("contactForm.subject")}
                  placeholder={t("contactForm.subject")}
                  required
                  error={errors.subject?.message}
                  options={enumOptions || []}
                  value={field.value || ""}
                  onChange={field.onChange}
                  className="mt-4"
                />
              )}
            />
          </div>
        </div>

        {/* Mobile Step 2 */}
        <div className="lg:hidden bg-white rounded-2xl p-4 sm:p-6 border border-ui-2 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-ui-11 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm md:text-base">
                2
              </span>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-ui-1">
                {t("contactForm.writeMessage")}
              </h3>
              <p className="text-sm text-ui-7">
                {t("contactForm.messageContent")}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <CustomUiSelect
                  title={t("contactForm.subject")}
                  placeholder={t("contactForm.subject")}
                  required
                  error={errors.subject?.message}
                  onChange={field.onChange}
                  options={enumOptions || []}
                  value={field.value || ""}
                  className="mt-4"
                />
              )}
            />
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <textarea
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-ui-4 transition-colors resize-none ${
                    errors.message ? "border-red-500" : "border-ui-2"
                  }`}
                  placeholder={t("contactForm.form.message")}
                  {...field}
                ></textarea>
              )}
            />
          </div>
        </div>
      </div>

      {/* Step 3 Mobile/Desktop Submit Button */}
      <div>
        <div className="hidden lg:flex relative items-center">
          <div className="w-1/2 pr-8 text-right">
            <h3 className="text-base md:text-lg font-semibold text-ui-1 mb-2">
              3. {t("contactForm.sendWaiting")}
            </h3>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
            <span className="text-white text-sm font-bold">3</span>
          </div>
          <div className="w-1/2 pl-8">
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className="bg-ui-4 text-white px-8 py-4 rounded-lg font-semibold hover:bg-ui-4/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? t("contactForm.sending") : t("contactForm.send")}
            </button>
          </div>
        </div>

        <div className="lg:hidden bg-white rounded-2xl p-4 sm:p-6 border border-ui-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 lg:w-10 h-8 lg:h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-semibold text-ui-1">
                {t("contactForm.sendWaiting")}
              </h3>
            </div>
          </div>

          <div className="bg-ui-5/30 rounded-lg  mb-6">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-ui-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-2 h-2 text-white"
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
          </div>

          <button
            type="submit"
            disabled={isPending || !isDirty}
            className="w-full bg-ui-4 text-white py-4 px-6 rounded-lg font-semibold hover:bg-ui-4/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            {isPending ? t("contactForm.sending") : t("contactForm.send")}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <section className="py-16 lg:py-24 bg-ui-10">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ui-1 mb-4 lg:mb-6">
              {t("contactForm.haveQuestion")}
            </h2>
            <p className="text-lg md:text-xl text-ui-7 max-w-2xl mx-auto">
              {t("contactForm.questionContentDesc")}
            </p>
          </div>

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
                    {t("contactForm.message.title")}
                  </h3>
                  <p className="text-base lg:text-lg text-gray-600 max-w-md mx-auto">
                    {t("contactForm.message.description")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">{renderForm()}</div>
          )}
        </div>
      </div>
    </section>
  );
}
