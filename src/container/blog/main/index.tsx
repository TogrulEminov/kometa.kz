import NavigationBar from "@/src/globalElements/navigationBar";
import React from "react";
import CardsContainer from "./cardsContainer";
import AdditionBlogSection from "./addition";
import BlogCta from "@/src/globalElements/bottomCta/blog";
import {
  BlogItem,
  CategoryItem,
  PaginationItem,
  SectionContent,
} from "@/src/services/interface";

interface Props {
  ctaData: SectionContent;
  categoriesData: CategoryItem;
  mainData: BlogItem[];
  paginations: PaginationItem;
}
export default function BlogPageContainer({
  categoriesData,
  paginations,
  ctaData,
  mainData,
}: Props) {
  const translations = categoriesData?.translations ?? [];
  const title = translations[0]?.title ?? "";
  const description = translations[0]?.description ?? "";
  const metaTitle = translations[0]?.seo?.metaTitle;
  return (
    <>
      <NavigationBar title={title} subtitle={description} variant="default" />
      <AdditionBlogSection
        title={title}
        description={description}
        metaTitle={metaTitle}
      />
      <CardsContainer currentData={mainData} paginations={paginations} />
      <BlogCta existingData={ctaData} />
    </>
  );
}
