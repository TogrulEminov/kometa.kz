import ProcessCards from "@/src/globalElements/cards/process-cards";
import React from "react";
import { SectionContent, WorkProcessItem } from "@/src/services/interface";

import { stripHtmlTags } from "@/src/lib/domburify";
interface Props {
  sectionData: SectionContent;
  processData: WorkProcessItem[];
}
export default async function OurProcess({ sectionData, processData }: Props) {
  if (!sectionData || !processData.length) {
    return null;
  }
  return (
    <section className="py-10 lg:py-25">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-[130px] flex flex-col space-y-6 h-fit">
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
          </div>

          <div className="lg:col-span-6 flex flex-col space-y-4">
            {processData?.map((item, index) => {
              return (
                <ProcessCards
                  key={item.id}
                  item={item as any}
                  index={index + 1}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
