import React from "react";
import ServicesDetailPageContainer from "@/src/container/services/detail";
import { generatePageMetadata } from "@/src/utils/metadata";
import { CustomLocales } from "@/src/services/interface";
import { Metadata } from "next";
import { getServicesSlugServer } from "@/src/actions/ui/services-slug.actions";
import { notFound } from "next/navigation";
interface PageProps {
  params: Promise<{ locale: string; slug }>;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale: locale,
    customPath: "services",
    dataType: "service",
    detail: true,
  });
}
export default async function ServicesDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const existingData = await getServicesSlugServer({
    locale: locale as CustomLocales,
    slug: slug,
  });

  if (!existingData?.data?.mainData?.translations?.length) {
    notFound();
  }
  return (
    <ServicesDetailPageContainer
      mainData={existingData?.data.mainCollection as any}
      detailData={existingData?.data.mainData as any}
      contactData={existingData?.data?.contactData as any}
    />
  );
}
