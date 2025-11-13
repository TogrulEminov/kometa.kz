import React from "react";
import FilterBarSelects from "../../../globalElements/filter";
import { stripHtmlTags } from "@/src/lib/domburify";
import { useTranslations } from "next-intl";

interface Props {
  title: string;
  description: string;
  metaTitle: string;
}

export default function AdditionPhotoSection({
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
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
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

          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-blue-700 font-medium">
              {t("photoGallery.badge")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
