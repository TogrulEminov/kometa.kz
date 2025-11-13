import { getServicesServer } from "@/src/actions/ui/services.actions";
import ServicesMainContainer from "@/src/container/services/main";
import { CustomLocales } from "@/src/services/interface";
import { generatePageMetadata } from "@/src/utils/metadata";
import { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | number | boolean }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale: locale,
    customPath: "services",
  });
}
export default async function ServicesPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const searchParamsData = await searchParams;
  const { page = 1 } = searchParamsData;
  const pageNumber = Number(page) || 1;
  const pageSize = 12;

  const existingData = await getServicesServer({
    page: pageNumber,
    pageSize: pageSize,
    locale: locale as CustomLocales,
  });
  if (!existingData?.data?.categoriesData?.translations) {
    notFound();
  }
  return (
    <ServicesMainContainer
      sectionCta={existingData?.sections?.ctaData as any}
      currentData={existingData?.data?.mainData as any}
      categoriesData={existingData?.data?.categoriesData as any}
      paginations={existingData?.paginations as any}
    />
  );
}
