import { getAboutServer } from "@/src/actions/ui/about.actions";
import AboutPageContainer from "@/src/container/about";
import { CustomLocales } from "@/src/services/interface";
import { generatePageMetadata } from "@/src/utils/metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
interface PageProps {
  params: Promise<{ locale: string }>;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale: locale,
    slug: "about",
    customPath: "about",
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;

  const existingData = await getAboutServer({
    locale: locale as CustomLocales,
  });
  if (!existingData?.data?.aboutData?.translations.length) {
    notFound();
  }
  return (
    <AboutPageContainer
      employeeData={existingData?.data?.employeeData as any}
      aboutData={existingData?.data?.aboutData as any}
      employeeSection={existingData?.sections?.employeeSection as any}
      categoriesData={existingData?.data?.categoriesData as any}
      contactCta={existingData?.sections?.contactCta as any}
      contactInfo={existingData?.data?.contactInfo as any}
    />
  );
}
