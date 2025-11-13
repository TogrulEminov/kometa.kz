import React from "react";
import SliderArea from "./slider";
import { SectionContent, TestimonialsItem } from "@/src/services/interface";
import { stripHtmlTags } from "@/src/lib/domburify";
interface Props {
  existingData: TestimonialsItem[];
  sectionData: SectionContent;
}
export default async function TestimonialsSection({
  sectionData,
  existingData,
}: Props) {
  if (!existingData.length || !sectionData) return null;
  return (
    <section className="py-10 lg:py-25  overflow-hidden">
      <div className="container">
        <article className="flex items-center justify-between mb-15">
          <div className="flex flex-col space-y-2">
            <span className="global-span">
              {sectionData?.translations?.[0]?.subTitle}
            </span>
            <strong className="global-strong">
              {sectionData?.translations?.[0]?.title}
            </strong>
            {sectionData?.translations?.[0]?.description && (
              <p className="global-pharagraph  max-w-3xl">
                {stripHtmlTags(sectionData?.translations?.[0]?.description)}
              </p>
            )}
          </div>
        </article>
        <SliderArea existingData={existingData as any} />
      </div>
    </section>
  );
}
