import React from "react";
import ReactFancyBox from "@/src/lib/fancybox";
import { PaginationItem, GalleryItem } from "@/src/services/interface";
import NoData from "@/src/ui-components/essential/no-data";
import PaginationContainer from "@/src/ui-components/pagination-client";
import PhotoGalleryCard from "@/src/globalElements/cards/photoGallery";
interface Props {
  currentData: GalleryItem[];
  paginations: PaginationItem;
}
export default function CardContainer({ currentData, paginations }: Props) {
  if (!currentData.length) {
    return <NoData />;
  }
  return (
    <section className="lg:pb-15 pb-10">
      <div className="container">
        <ReactFancyBox className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentData?.map((item: any, index: number) => {
            return <PhotoGalleryCard item={item} key={index} />;
          })}
        </ReactFancyBox>

        <PaginationContainer paginations={paginations} />
      </div>
    </section>
  );
}
