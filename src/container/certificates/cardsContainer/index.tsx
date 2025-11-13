import React from "react";
import CertificatesCards from "@/src/globalElements/cards/certificates";
import ReactFancyBox from "@/src/lib/fancybox";
import { Certificates, PaginationItem } from "@/src/services/interface";
import NoData from "@/src/ui-components/essential/no-data";
import PaginationContainer from "@/src/ui-components/pagination-client";
interface Props {
  currentData: Certificates[];
  paginations: PaginationItem;
}
export default function CardsContainer({ currentData, paginations }: Props) {
  if (!currentData.length) {
    return <NoData />;
  }
  return (
    <section className="pb-10 lg:pb-15">
      <div className="container">
        <ReactFancyBox className="grid  grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3">
          {currentData?.map((item, index) => {
            return <CertificatesCards item={item} key={index} />;
          })}
        </ReactFancyBox>
        <PaginationContainer paginations={paginations} />
      </div>
    </section>
  );
}
