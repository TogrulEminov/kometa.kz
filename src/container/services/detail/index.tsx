import React from "react";
import RightArea from "./right";
import LeftArea from "./left";
import NavigationBar from "@/src/globalElements/navigationBar";
import { ContactInfo, FileType, ServicesItem } from "@/src/services/interface";
import { getForCards } from "@/src/utils/getFullimageUrl";
import Script from "next/script";
interface Props {
  mainData: ServicesItem[];
  detailData: ServicesItem;
  contactData: ContactInfo;
}
export default function ServicesDetailPageContainer({
  mainData,
  detailData,
  contactData,
}: Props) {
  const translations = detailData?.translations?.[0];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Locale-a uyğun path-i routing-dən götürürük
  const getLocalizedPath = (locale: string, slug: string) => {
    const pathMap = {
      az: `/xidmetlerimiz/${slug}`,
      en: `/services/${slug}`,
      ru: `/uslugi/${slug}`,
    };
    return pathMap[locale as keyof typeof pathMap] || `/services/${slug}`;
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
    "@type": "Service",
    name: translations?.title,
    description: translations?.description,
    image: getForCards(detailData?.imageUrl as FileType),
    serviceType: translations?.title,
    provider: {
      "@type": "Organization",
      name: "Profi Transport",
      url: baseUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Azerbaijan",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Business",
    },
    url: getFullUrl(translations?.locale || "az", translations?.slug || ""),
    aggregateRating: translations?.features?.length
      ? {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: translations.features.length.toString(),
        }
      : undefined,
    brand: {
      "@type": "Brand",
      name: "Profi Transport",
    },
    additionalType: "https://schema.org/ProfessionalService",
    slogan: translations?.shortDescription,
    inLanguage: translations?.locale,
    dateModified: detailData?.updatedAt,
    datePublished: detailData?.createdAt,
  };

  return (
    <>
      <NavigationBar title={translations?.title} variant="default" />
      <section className="py-12 lg:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            <LeftArea mainData={mainData} contactData={contactData} />
            <RightArea existingData={detailData} />
          </div>
        </div>
      </section>
      <Script
        id="service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
