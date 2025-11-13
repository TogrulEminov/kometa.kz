import NavigationBar from "@/src/globalElements/navigationBar";
import React from "react";
import AdditionSection from "./addition";
import InternationalBranches from "./international-branch";
import ContactForm from "./main/form";
import {
  BranchItem,
  CategoryItem,
  ContactInfo,
} from "@/src/services/interface";
interface Props {
  categoriesData: CategoryItem;
  contactData: ContactInfo;
  branches: BranchItem[];
}
export default function ContactPageContainer({
  categoriesData,
  contactData,
  branches,
}: Props) {
  const translations = categoriesData?.translations ?? [];
  const title = translations[0]?.title ?? "";
  const description = translations[0]?.description ?? "";
  return (
    <>
      <NavigationBar title={title} subtitle={description} variant="default" />
      <AdditionSection contactData={contactData} />
      <ContactForm />
      <InternationalBranches branches={branches} />
    </>
  );
}
