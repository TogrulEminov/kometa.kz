import Icons from "@/public/icons";
import { Link } from "@/src/i18n/navigation";
import { BlogItem, InfoGenericType } from "@/src/services/interface";
import React from "react";
import { parseJSON } from "@/src/utils/checkSlug";
import { sanitizeHtml } from "@/src/lib/domburify";
import PreviesNextData from "./previousNext";
import { useTranslations } from "next-intl";
interface Props {
  existingData: BlogItem;
  previousData: any;
}
export default function ContentArea({ existingData, previousData }: Props) {
  const translations = existingData?.translations?.[0];
  const t = useTranslations();
  return (
    <>
      {/* Content - Responsive Typography */}
      <article
        className="prose prose-base sm:prose-lg lg:prose-xl max-w-none mb-12 sm:mb-16 text-base sm:text-lg lg:text-2xl leading-relaxed text-gray-700 first-letter:text-4xl sm:first-letter:text-5xl lg:first-letter:text-6xl first-letter:font-bold first-letter:text-ui-1 first-letter:float-left first-letter:mr-2 sm:first-letter:mr-3 first-letter:leading-none first-letter:mt-1"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(translations?.description),
        }}
      />
      <div className="mt-12 pt-8 border-t border-ui-2 mb-10">
        <h3 className="text-lg font-semibold text-ui-1 mb-4">
          {t("blogPage.tegs")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {parseJSON<InfoGenericType>(translations?.tags).map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-ui-10 hover:bg-ui-5 text-ui-1 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              #{tag?.title}
            </span>
          ))}
        </div>
      </div>
      <PreviesNextData previousData={previousData} />
      <div className="text-center mt-8 sm:mt-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 sm:px-6   py-2.5 sm:py-3 text-ui-7 hover:text-ui-1 transition-all font-medium group text-sm sm:text-base"
        >
          <Icons.ArrowLeft />
          {t("blogPage.returnOther")}
        </Link>
      </div>
    </>
  );
}
