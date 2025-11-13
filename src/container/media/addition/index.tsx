import React from "react";
import FilterBarSelects from "../../../globalElements/filter";
import { stripHtmlTags } from "@/src/lib/domburify";
import { useTranslations } from "next-intl";
interface Props {
  title: string;
  description: string;
  metaTitle: string;
}
export default function AdditionMediaSection({
  title,
  description,
  metaTitle,
}: Props) {
  const t = useTranslations();
  return (
    <section className="py-10 lg:py-15">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <h1
              className="text-3xl lg:text-4xl font-bold text-ui-1"
              title={metaTitle}
            >
              {title}
            </h1>
          </div>

          <div className="flex-shrink-0 w-full lg:w-80">
            <FilterBarSelects />
          </div>
        </div>

        <div className="max-w-4xl">
          <p className="text-lg text-ui-7 leading-relaxed mb-4">
            {stripHtmlTags(description)}
          </p>

          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 text-sm">
            <svg
              className="w-4 h-4 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="text-red-700 font-medium">
              {t("mediaData.one")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
