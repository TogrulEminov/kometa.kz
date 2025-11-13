import NavigationBar from "@/src/globalElements/navigationBar";
import React from "react";
import CardContainer from "./cardContainer";
import AdditionGallerySection from "./addition";
import {
  CategoryItem,
  GalleryItem,
  PaginationItem,
  SectionContent,
  Social,
} from "@/src/services/interface";
interface Props {
  currentData: GalleryItem[];
  paginations: PaginationItem;
  categoriesData?: CategoryItem;
  sectionCta: SectionContent;
  socialData: Social;
}
export default function PhotoesPageContainer({
  currentData,
  paginations,
  categoriesData,
}: Props) {
  const translations = categoriesData?.translations ?? [];
  const title = translations[0]?.title ?? "";
  const description = translations[0]?.description ?? "";
  const metaTitle = translations[0]?.seo?.metaTitle;

  return (
    <>
      <NavigationBar title={title} subtitle={description} variant="default" />
      <AdditionGallerySection
        title={title}
        description={description}
        metaTitle={metaTitle}
      />
      <CardContainer currentData={currentData} paginations={paginations} />
    </>
  );
}
