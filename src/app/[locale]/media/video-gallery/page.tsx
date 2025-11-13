import { getMediaServer } from "@/src/actions/ui/media.actions";
import MediaPageContainer from "@/src/container/media";
import { CustomLocales } from "@/src/services/interface";
import { generatePageMetadata } from "@/src/utils/metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
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
    slug: "media",
    customPath: "media",
  });
}
export default async function MediaPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const searchParamsData = await searchParams;
  const { sort = "desc", page = 1 } = searchParamsData;
  const pageNumber = Number(page) || 1;
  const pageSize = 12;
  const existingData = await getMediaServer({
    page: pageNumber,
    pageSize: pageSize,
    sort: sort as string,
    locale: locale as CustomLocales,
  });
  if (!existingData?.data?.categoriesData?.translations) {
    notFound();
  }
  return (
    <MediaPageContainer
      currentData={existingData?.data.mainData as any}
      categoriesData={existingData?.data?.categoriesData as any}
      paginations={existingData?.paginations as any}
      sectionCta={existingData?.sections?.ctaData as any}
      socialData={existingData?.data?.socialData as any}
    />
  );
}
