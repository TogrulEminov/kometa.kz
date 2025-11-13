import React from "react";
import ReactFancyBox from "@/src/lib/fancybox";
import ServicesCard from "@/src/globalElements/cards/services";
import { PaginationItem, ServicesItem } from "@/src/services/interface";
import NoData from "@/src/ui-components/essential/no-data";
import PaginationContainer from "@/src/ui-components/pagination-client";
interface Props {
  currentData: ServicesItem[];
  paginations: PaginationItem;
}
export default function CardContainer({ currentData, paginations }: Props) {
  if (!currentData?.length) {
    return <NoData />;
  }

  return (
    <section className="lg:pb-15 pb-10">
      <div className="container">
        <ReactFancyBox className="grid  grid-cols-1 sm:grid-cols-2  gap-3">
          {currentData?.map((item: any, index: number) => {
            return <ServicesCard item={item} key={index} />;
          })}
        </ReactFancyBox>
        <PaginationContainer paginations={paginations} />
      </div>
    </section>
  );
}
