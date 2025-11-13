// app/FAQ.tsx
import React from "react";
import {
  AccordionProvider,
  AccordionItem,
  AccordionHead,
  AccordionBody,
} from "@/src/globalElements/customAccordion"; // path'i düzəldin
import data from "@/src/json/values/data.json";
import { stripHtmlTags } from "@/src/lib/domburify";
import { FagItem, SectionContent } from "@/src/services/interface";
interface Props {
  existingData: FagItem[];
  sectionData: SectionContent;
}
export default async function FagSection({ existingData, sectionData }: Props) {
  if (!existingData.length || !sectionData) {
    return null;
  }

  return (
    <section className="py-10 lg:py-20 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-4">
              <span className="text-sm min-w-20 lg:text-sm font-semibold text-ui-7">
                {sectionData?.translations?.[0]?.subTitle}
              </span>
            </div>
            <h2 className="text-2xl lg:text-4xl md:text-5xl font-bold text-ui-1 mb-4">
              {sectionData?.translations?.[0]?.title}
            </h2>
            {sectionData?.translations?.[0]?.description && (
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                {stripHtmlTags(sectionData?.translations?.[0]?.description)}
              </p>
            )}
          </div>

          {/* Accordion */}
          <div className="overflow-hidden">
            <AccordionProvider type="single">
              {existingData?.map((faq, index) => {
                const { title, description } = faq?.translations?.[0];
                return (
                  <AccordionItem
                    key={faq.id}
                    id={faq.documentId}
                    className={`${
                      index !== data?.fag?.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <AccordionHead className="w-full px-6 py-5 text-left hover:bg-slate-50 transition-colors duration-200">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-slate-700 font-bold text-sm">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <h3 className="text-base lg:text-lg font-semibold text-ui-1 pr-4">
                            {title}
                          </h3>
                        </div>
                      </div>
                    </AccordionHead>
                    {description && (
                      <AccordionBody className="px-6 py-5 bg-slate-50">
                        <div className="lg:ml-12 lg:pr-9">
                          <p className="text-ui-7 textr-sm lg:text-base leading-relaxed">
                            {stripHtmlTags(description)}
                          </p>
                        </div>
                      </AccordionBody>
                    )}
                  </AccordionItem>
                );
              })}
            </AccordionProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
