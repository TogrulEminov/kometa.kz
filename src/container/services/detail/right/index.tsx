import React from "react";
import CustomImage from "@/src/globalElements/ImageTag";
import {
  AccordionBody,
  AccordionHead,
  AccordionItem,
  AccordionProvider,
} from "@/src/globalElements/customAccordion";
import { sanitizeHtml, stripHtmlTags } from "@/src/lib/domburify";
import {
  FileType,
  InfoGenericType,
  ServicesItem,
} from "@/src/services/interface";
import { getForCards } from "@/src/utils/getFullimageUrl";
import { parseJSON } from "@/src/utils/checkSlug";
import { useTranslations } from "next-intl";
interface Props {
  existingData: ServicesItem;
}
export default function RightArea({ existingData }: Props) {
  const translations = existingData?.translations?.[0];
  const t = useTranslations();
  // Bütün bölmələri array kimi təyin edirik
  const sections = [
    {
      title: t("servicesPage.moreAbout"),
      content: translations?.description,
      render: (
        <article
          className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-color text-gray-700 leading-relaxed mb-6 text-sm lg:text-base services_list"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(translations?.description),
          }}
        />
      ),
    },
    {
      title: t("servicesPage.features"),
      content: parseJSON<InfoGenericType>(translations?.features),
      render: (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parseJSON<InfoGenericType>(translations?.features)?.map(
            (feature, i) => (
              <div
                key={i}
                className="p-5 bg-white border border-ui-2 rounded-xl hover:shadow-md hover:border-ui-4 transition-all"
              >
                <div className="w-8 h-1 bg-ui-4 rounded-full mb-3 shrink-0"></div>
                <h3 className="font-bold text-ui-1 mb-2 text-base lg:text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          )}
        </div>
      ),
    },
    {
      title: t("servicesPage.advantages"),
      content: parseJSON<InfoGenericType>(translations?.advantages),
      render: (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {parseJSON<InfoGenericType>(translations?.advantages)?.map(
            (item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-ui-10 rounded-lg hover:bg-ui-4/10 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-ui-4 shrink-0"></div>
                <span className="text-sm text-gray-700 font-medium">
                  {item?.title}
                </span>
              </div>
            )
          )}
        </div>
      ),
    },
    {
      title: t("servicesPage.fag"),
      content: parseJSON<InfoGenericType>(translations?.fags),
      render: (
        <div className="space-y-3">
          <AccordionProvider type="single">
            {parseJSON<InfoGenericType>(translations?.fags)?.map(
              (faq, index) => (
                <AccordionItem
                  key={index}
                  id={`${faq?.title}-${index}`}
                  className="border border-ui-2 rounded-xl overflow-hidden"
                >
                  <AccordionHead className="w-full px-4 sm:px-5 py-3 sm:py-4 text-left hover:bg-ui-10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-ui-4 font-bold text-sm">
                        0{index + 1}
                      </span>
                      <h3 className="font-semibold text-ui-1 text-sm sm:text-base flex-1">
                        {faq?.title}
                      </h3>
                    </div>
                  </AccordionHead>
                  {faq?.description && (
                    <AccordionBody className="px-4 sm:px-5 py-3 sm:py-4 bg-ui-10 border-t border-ui-2">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {stripHtmlTags(faq?.description)}
                      </p>
                    </AccordionBody>
                  )}
                </AccordionItem>
              )
            )}
          </AccordionProvider>
        </div>
      ),
    },
  ];

  // Yalnız məlumatı olan bölmələri filter edirik
  const availableSections = sections.filter((section) => {
    if (Array.isArray(section.content)) {
      return section.content.length > 0;
    }
    return section.content;
  });

  return (
    <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl group flex items-end w-full h-75 md:h-101 lg:115">
        <CustomImage
          className="w-full absolute inset-0 h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={1000}
          height={400}
          title={translations?.seo?.metaTitle}
          src={getForCards(existingData?.imageUrl as FileType)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ui-1/95 to-ui-1/70 opacity-80 flex items-center"></div>
        <div className="p-6 lg:p-12 relative z-[2]">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-12 bg-ui-4"></div>
          </div>
          <h1
            title={translations?.seo?.metaTitle}
            className="text-2xl sm:text-4xl font-bold text-white mb-2 leading-tight"
          >
            {translations?.title}
          </h1>
        </div>
      </div>

      {/* Content Sections - Dinamik nömrələmə */}
      <div className="space-y-6">
        {availableSections.map((section, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-ui-2 p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4 sm:gap-6 mb-6">
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ui-4/10 leading-none">
                {(idx + 1).toString().padStart(2, "0")}
              </div>
              <div className="flex-1 pt-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ui-1">
                  {section.title}
                </h2>
              </div>
            </div>
            {section.render}
          </div>
        ))}
      </div>
    </div>
  );
}
