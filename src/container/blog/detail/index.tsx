import React from "react";
import HeadArea from "./head";
import NavigationBar from "@/src/globalElements/navigationBar";
import { BlogItem, FileType } from "@/src/services/interface";
import { getForCards } from "@/src/utils/getFullimageUrl";
import Script from "next/script";
interface Props {
  existingData: BlogItem;
  previousData: any;
}
export default function BlogDetailContainer({
  existingData,
  previousData,
}: Props) {
  const translations = existingData?.translations?.[0];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";

  // Locale-a uyğun path-i routing-dən götürürük
  const getLocalizedPath = (locale: string, slug: string) => {
    const pathMap = {
      az: `/bloqlar/${slug}`,
      en: `/blogs/${slug}`,
      ru: `/bloqi/${slug}`,
    };
    return pathMap[locale as keyof typeof pathMap] || `/blogs/${slug}`;
  };

  const getFullUrl = (locale: string, slug: string) => {
    const path = getLocalizedPath(locale, slug);
    if (locale === "az") {
      return `${baseUrl}${path}`;
    }
    return `${baseUrl}/${locale}${path}`;
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: translations?.title,
    description: translations?.description,
    image: getForCards(existingData?.imageUrl as FileType),
    datePublished: existingData?.createdAt,
    dateModified: existingData?.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getFullUrl(translations?.locale || "az", translations?.slug || ""),
    },
    keywords: translations?.seo?.metaKeywords,
    articleBody: translations?.description,
    inLanguage: translations?.locale,
    timeRequired: translations?.readTime,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ReadAction",
      userInteractionCount: existingData?.view,
    },
  };

  return (
    <>
      <NavigationBar title={translations?.title} variant="default" />
      <HeadArea existingData={existingData} previousData={previousData} />
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
