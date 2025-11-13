import React from "react";
import HeroSection from "./hero";
import Services from "./services";
import WhyChoosUs from "./why-choose-us";
import ReliabilityFeature from "./reliability-feature";
import OurProcess from "./our-process";
import BlogSection from "./blog";
// import PartnersSection from "./partners";
import TestimonialsSection from "./testimonials";
import CallAction from "./call-action";
import FagSection from "./fag";
import BranchesMap from "./mapping";
import VideoSection from "./video-media";
import ContactCta from "@/src/globalElements/bottomCta/contact";
interface Props {
  data: any;
}
export default function HomePageContainer({ data }: Props) {
  return (
    <>
      <HeroSection data={data?.data?.heroData} />
      <WhyChoosUs
        sectionData={data?.data?.featuresData}
        advantagesData={data?.data?.advantagesData}
      />
      {/* Neden biz */}
      <Services
        serviceData={data?.data?.serviceData}
        sectionData={data?.sections?.servicesSection}
      />
      {/* Xidmətlər */}
      <ReliabilityFeature data={data?.data?.contactInfo} /> {/* Güvenilirlik */}
      <OurProcess
        processData={data?.data?.workProcessData}
        sectionData={data?.sections?.processSection}
      />
      {/* İş prosesi */}
      <BranchesMap
        branches={data?.data?.branchesData}
        sectionData={data?.sections?.branchesSection}
      />
      <VideoSection
        existingData={data?.data?.mediaData}
        sectionData={data?.sections?.mediaSection}
      />
      {/* Video galeri */}
      <BlogSection
        sectionData={data?.sections?.blogSection}
        existingData={data?.data?.blogData}
      />
      {/* Bloglar */}
      <TestimonialsSection
        sectionData={data?.sections?.testimonialsSection}
        existingData={data?.data?.reviewsData}
      />
      {/* Müşteri reyleri */}
      {/* <PartnersSection
        sectionData={data?.sections?.partnersSection}
        existingData={data?.data?.partnersData}s
      /> */}
      {/* Partnyorlar */}
      <CallAction />
      {/*call action */}
      <FagSection
        sectionData={data?.sections?.fagSection}
        existingData={data?.data?.fagsData}
      />
      {/*Bottom fag */}
      <ContactCta
        main={true}
        contactData={data?.data?.contactInfo}
        contactCta={data?.sections?.contactCta}
      />
    </>
  );
}
