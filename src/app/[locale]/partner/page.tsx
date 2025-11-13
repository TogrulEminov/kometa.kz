// import React from "react";
// import { getPartnerServer } from "@/src/actions/ui/partner.actions";
// import PartnersPageContainer from "@/src/container/partners";
// import { CustomLocales } from "@/src/services/interface";
// import { generatePageMetadata } from "@/src/utils/metadata";
// import { Metadata } from "next";
import { notFound } from "next/navigation";
// interface PageProps {
//   params: Promise<{ locale: string }>;
//   searchParams: Promise<{ [key: string]: string | number | boolean }>;
// }
// export async function generateMetadata({
//   params,
// }: PageProps): Promise<Metadata> {
//   const { locale } = await params;
//   return generatePageMetadata({
//     locale: locale,
//     slug: "partner",
//     customPath: "partner",
//     dataType: "category",
//   });
// }
// export default async function PartnersPage({ params }: PageProps) {
//   const { locale } = await params;
//   const existingData = await getPartnerServer({
//     locale: locale as CustomLocales,
//   });

//   if (!existingData?.data?.categoriesData?.translations) {
//     notFound();
//   }
//   return (
//     <PartnersPageContainer
//       currentData={existingData?.data?.mainData as any}
//       categoriesData={existingData?.data?.categoriesData as any}
//     />
//   );
// }

export default async function PartnersPage() {
  return notFound();
}
