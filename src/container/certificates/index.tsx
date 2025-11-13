import NavigationBar from "@/src/globalElements/navigationBar";
import React from "react";
import CardsContainer from "./cardsContainer";
import AdditionCertificates from "./addition";
import ContactCta from "@/src/globalElements/bottomCta/contact";
import {
  CategoryItem,
  Certificates,
  ContactInfo,
  PaginationItem,
  SectionContent,
} from "@/src/services/interface";

interface Props {
  categoriesData: CategoryItem;
  mainData: Certificates[];
  paginations: PaginationItem;
  contactInfo: ContactInfo;
  contactCta: SectionContent;
}
export default function CertificatesPageContainer({
  categoriesData,
  mainData,
  paginations,
  contactInfo,
  contactCta,
}: Props) {
  const translations = categoriesData?.translations ?? [];
  const title = translations[0]?.title ?? "";
  const description = translations[0]?.description ?? "";
  const metaTitle = translations[0]?.seo?.metaTitle;
  return (
    <>
      <NavigationBar title={title} subtitle={description} variant="default" />
      <AdditionCertificates
        title={title}
        description={description}
        metaTitle={metaTitle}
      />
      <CardsContainer currentData={mainData} paginations={paginations} />
      <ContactCta contactData={contactInfo} contactCta={contactCta} />
    </>
  );
}
