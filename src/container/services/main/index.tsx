import NavigationBar from "@/src/globalElements/navigationBar";
import React from "react";
import AdditionServicesSection from "./addition";
import CardContainer from "./cardContainer";
import ServicesCta from "@/src/globalElements/bottomCta/services";
import {
  CategoryItem,
  PaginationItem,
  SectionContent,
  ServicesItem,
} from "@/src/services/interface";
interface Props {
  currentData: ServicesItem[];
  paginations: PaginationItem;
  categoriesData: CategoryItem;
  sectionCta: SectionContent;
}
export default function ServicesMainContainer({
  currentData,
  paginations,
  categoriesData,
  sectionCta,
}: Props) {
  const translations = categoriesData?.translations ?? [];
  const title = translations[0]?.title ?? "";
  const description = translations[0]?.description ?? "";
  const metaTitle = translations[0]?.seo?.metaTitle;

  return (
    <>
      <NavigationBar title={title} subtitle={description} variant="default" />
      <AdditionServicesSection
        title={title}
        description={description}
        metaTitle={metaTitle}
      />
      <CardContainer currentData={currentData} paginations={paginations} />
      <ServicesCta sectionData={sectionCta} />
    </>
  );
}
