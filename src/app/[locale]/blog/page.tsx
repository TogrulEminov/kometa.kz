import { getBlogServer } from "@/src/actions/ui/blog.actions";
import BlogPageContainer from "@/src/container/blog/main";
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
    customPath: "blog",
    dataType: "category",
    detail: false,
  });
}
export default async function BlogPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const searchParamsData = await searchParams;
  const { sort = "desc", page = 1 } = searchParamsData;
  const pageNumber = Number(page) || 1;
  const pageSize = 12;

  const existingData = await getBlogServer({
    page: pageNumber,
    pageSize: pageSize,
    sort: sort as string,
    locale: locale as CustomLocales,
  });
  if (!existingData?.data?.categoriesData?.translations) {
    notFound();
  }
  return (
    <BlogPageContainer
      categoriesData={existingData?.data?.categoriesData as any}
      mainData={existingData?.data?.mainData as any}
      paginations={existingData?.paginations as any}
      ctaData={existingData?.sections?.ctaData as any}
    />
  );
}
