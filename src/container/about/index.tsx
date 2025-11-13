import NavigationBar from "@/src/globalElements/navigationBar";
import React from "react";
import EmployeeSection from "./employee-area";
import AboutContent from "./head";
import AboutServicesCta from "@/src/globalElements/bottomCta/about";
import {
  About,
  CategoryItem,
  ContactInfo,
  Employee,
  SectionContent,
} from "@/src/services/interface";
interface Props {
  aboutData: About;
  employeeData: Employee;
  categoriesData: CategoryItem;
  employeeSection: SectionContent;
  contactInfo: ContactInfo;
  contactCta: SectionContent;
}
export default function AboutPageContainer({
  categoriesData,
  aboutData,
  employeeData,
  employeeSection,
  contactCta,
  contactInfo,
}: Props) {
  const translations = categoriesData?.translations ?? [];
  const title = translations[0]?.title ?? "";
  const description = translations[0]?.description ?? "";
  return (
    <>
      <NavigationBar title={title} subtitle={description} variant="default" />
      <AboutContent data={aboutData as any} />
      <EmployeeSection
        existingData={employeeData as any}
        sectionData={employeeSection}
      />
      <AboutServicesCta section={contactCta as any} data={contactInfo as any} />
    </>
  );
}
