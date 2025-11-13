import { getBlogSlugServer } from "@/src/actions/ui/blog-slug.actions";
import BlogDetailContainer from "@/src/container/blog/detail";
import { CustomLocales } from "@/src/services/interface";
import { generatePageMetadata } from "@/src/utils/metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
interface PageProps {
  params: Promise<{ locale: string; slug }>;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale: locale,
    customPath: "blog",
    detail: true,
    dataType: "blog",
  });
}
export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const existingData = await getBlogSlugServer({
    slug: slug,
    locale: locale as CustomLocales,
  });

  if (!existingData?.data?.mainData?.translations?.length) {
    notFound();
  }
  return (
    <BlogDetailContainer
      existingData={existingData?.data?.mainData as any}
      previousData={existingData?.data?.previousNextData}
    />
  );
}
