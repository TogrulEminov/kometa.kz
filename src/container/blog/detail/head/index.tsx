import Icons from "@/public/icons";
import CustomImage from "@/src/globalElements/ImageTag";
import React from "react";
import ContentArea from "../body";
import { BlogItem, FileType } from "@/src/services/interface";
import dayjs from "dayjs";
interface Props {
  existingData: BlogItem;
  previousData: any;
}
import "dayjs/locale/az";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import ShareButton from "@/src/globalElements/shareButton";
import { getForCards } from "@/src/utils/getFullimageUrl";
import { useTranslations } from "next-intl";
export default function HeadArea({ existingData, previousData }: Props) {
  const translations = existingData?.translations?.[0];
  dayjs.locale(translations?.locale);
  const t = useTranslations();
  return (
    <section className="py-10 lg:py-20">
      <div className="container max-w-4xl">
        {/* Enhanced Header */}
        <div className="mb-8 lg:mb-12">
          {/* Title - Responsive */}
          <h1
            title={translations?.seo?.metaDescription}
            className="text-3xl lg:text-4xl  font-bold text-ui-1 mb-4 sm:mb-6 leading-tight tracking-tight"
          >
            {translations?.title}
          </h1>
          {/* Meta Info - Fully Responsive */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-ui-7 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-ui-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-ui-4 bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Icons.Calendar />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("blogPage.date")}</p>
                <p className="text-xs sm:text-sm font-semibold text-ui-1 capitalize whitespace-nowrap">
                  {dayjs(existingData?.createdAt).format("MMMM D, YYYY")}
                </p>
              </div>
            </div>

            <span className="hidden sm:block w-px h-8 bg-gray-300"></span>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Icons.Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("blogPage.reading")}</p>
                <p className="text-xs sm:text-sm font-semibold text-ui-1">
                  {translations?.readTime}
                </p>
              </div>
            </div>

            <span className="hidden sm:block w-px h-8 bg-gray-300"></span>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <Icons.View />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("blogPage.view")}</p>
                <p className="text-xs sm:text-sm font-semibold text-ui-1">
                  {existingData?.view}
                </p>
              </div>
            </div>
          </div>

          {/* Share Button - Responsive */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <ShareButton className="px-5 cursor-pointer sm:px-6 py-2.5 sm:py-3 bg-ui-1 text-white rounded-xl hover:bg-ui-1/90 hover:shadow-lg transition-all font-medium flex items-center gap-2 text-sm sm:text-base" />
          </div>
        </div>

        {/* Featured Image - Responsive */}
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-12 shadow-xl sm:shadow-2xl group">
          <CustomImage
            width={1200}
            height={600}
            title="Blog cover"
            src={getForCards(existingData?.imageUrl as FileType)}
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <ContentArea existingData={existingData} previousData={previousData} />
      </div>
    </section>
  );
}
