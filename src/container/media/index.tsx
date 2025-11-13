import NavigationBar from "@/src/globalElements/navigationBar";
import React from "react";
import CardContainer from "./cardContainer";
import YoutubeCta from "@/src/globalElements/bottomCta/youtube";
import AdditionMediaSection from "./addition";
import {
  CategoryItem,
  PaginationItem,
  SectionContent,
  Social,
  YoutubeItems,
} from "@/src/services/interface";
interface Props {
  currentData: YoutubeItems[];
  paginations: PaginationItem;
  categoriesData?: CategoryItem;
  sectionCta: SectionContent;
  socialData: Social;
}
export default function MediaPageContainer({
  currentData,
  paginations,
  categoriesData,
  socialData,
  sectionCta,
}: Props) {
  const translations = categoriesData?.translations ?? [];
  const title = translations[0]?.title ?? "";
  const description = translations[0]?.description ?? "";
  const metaTitle = translations[0]?.seo?.metaTitle;

  return (
    <>
      <NavigationBar title={title} subtitle={description} variant="default" />
      <AdditionMediaSection
        title={title}
        description={description}
        metaTitle={metaTitle}
      />
      <CardContainer currentData={currentData} paginations={paginations} />
      <YoutubeCta
        sectionCta={sectionCta as any}
        socialData={socialData as any}
      />
    </>
  );
}
