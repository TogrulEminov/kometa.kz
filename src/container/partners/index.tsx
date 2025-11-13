import React from "react";
import AdditionPartners from "./addition";
import NavigationBar from "@/src/globalElements/navigationBar";
import ParntersDataContainer from "./cardsContainer";
import { CategoryItem, ConnectionItem } from "@/src/services/interface";
interface Props {
  currentData: ConnectionItem[];
  categoriesData?: CategoryItem;
}
export default function PartnersPageContainer({
  currentData,
  categoriesData,
}: Props) {
  const translations = categoriesData?.translations ?? [];
  const title = translations[0]?.title ?? "";
  const description = translations[0]?.description ?? "";
  const metaTitle = translations[0]?.seo?.metaTitle;
  return (
    <>
      <NavigationBar title={title} subtitle={description} variant="default" />
      <AdditionPartners
        title={title}
        description={description}
        metaTitle={metaTitle}
      />
      <ParntersDataContainer currentData={currentData} />
    </>
  );
}
