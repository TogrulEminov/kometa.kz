"use client";
import React, { useRef } from "react";
import MySwiper from "@/src/lib/swiper";
import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper/types";
import { Autoplay } from "swiper/modules";
import EmployeeCards from "@/src/globalElements/cards/employee";
import { Employee } from "@/src/services/interface";
import NoData from "@/src/ui-components/essential/no-data";
interface Props {
  existingData: Employee[];
}
export default function SliderArea({ existingData }: Props) {
  const swiperRef = useRef<SwiperCore | null>(null);

  const breakpoints = {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  };
  const autoplayOptions = {
    delay: 3500,
    disableOnInteraction: false,
  };
  const keyboard = {
    enabled: true,
    onlyInViewport: false,
  };

  const handleSwiper = (swiper: SwiperCore) => {
    swiperRef.current = swiper;
  };

  if (!existingData?.length) {
    return <NoData />;
  }
  return (
    <div className="relative pb-12">
      <MySwiper
        modules={[Autoplay]}
        onSwiper={handleSwiper}
        breakpoints={breakpoints}
        spaceBetween={15}
        slideToClickedSlide={true}
        watchSlidesProgress={true}
        centeredSlides={false}
        slidesPerView={3}
        autoplay={autoplayOptions}
        roundLengths={true}
        keyboard={keyboard}
        className="w-full"
        loop={true}
      >
        {existingData?.map((item: any, index: number) => {
          return (
            <SwiperSlide key={item?.id || index} className="h-full">
              <EmployeeCards item={item} />
            </SwiperSlide>
          );
        })}
      </MySwiper>
    </div>
  );
}
