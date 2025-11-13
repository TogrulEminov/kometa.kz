import { getContactServer } from "@/src/actions/ui/contact.actions";
import ContactPageContainer from "@/src/container/contact";
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
    slug: "contact",
    customPath: "contact",
  });
}
export const dynamic = "force-dynamic";
export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;

  const existingData = await getContactServer({
    locale: locale as CustomLocales,
  });
  if (!existingData?.data?.categoriesData?.translations) {
    notFound();
  }
  return (
    <ContactPageContainer
      branches={existingData?.data?.branchesData as any}
      categoriesData={existingData?.data?.categoriesData as any}
      contactData={existingData?.data?.mainData as any}
    />
  );
}
