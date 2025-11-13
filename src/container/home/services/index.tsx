import React from "react";
import SliderArea from "./slider";
import { SectionContent, ServicesItem } from "@/src/services/interface";
import { stripHtmlTags } from "@/src/lib/domburify";
interface Props {
  serviceData: ServicesItem[];
  sectionData: SectionContent;
}
export default async function Services({ serviceData, sectionData }: Props) {
  if (!serviceData.length || !sectionData) {
    return null;
  }

  return (
    <section className="py-10 lg:py-25 bg-gray-50  overflow-hidden">
      <div className="container">
        <article className="flex items-center justify-between mb-8 lg:mb-15">
          <div className="flex flex-col space-y-2">
            <span className="global-span">
              {sectionData?.translations?.[0]?.subTitle}
            </span>
            <strong className="global-strong">
              {sectionData?.translations?.[0]?.title}
            </strong>
            {sectionData?.translations?.[0]?.description && (
              <p className="global-pharagraph  max-w-xl">
                {stripHtmlTags(sectionData?.translations?.[0]?.description)}
              </p>
            )}
          </div>
        </article>
        <SliderArea serviceData={serviceData as any} />
      </div>
    </section>
  );
}
