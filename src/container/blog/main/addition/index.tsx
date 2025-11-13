import FilterBarSelects from "@/src/globalElements/filter";
import { stripHtmlTags } from "@/src/lib/domburify";
import { useTranslations } from "next-intl";
import React from "react";
interface Props {
  title: string;
  description: string;
  metaTitle: string;
}
export default function AdditionBlogSection({
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
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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

          <div className="text-sm text-ui-7">
            <span className="bg-gray-100 px-3 py-1 rounded-md">
              {t("blogPage.weeklyUptade")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
