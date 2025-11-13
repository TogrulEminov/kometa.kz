"use client";
import React from "react";
import dynamic from "next/dynamic";

const MyMap = dynamic(() => import("./myMapContainer"), {
  ssr: false,
});

export default function MyMapContainer({
  lat,
  lng,
}: {
  lat: string;
  lng: string;
}) {
  return <MyMap lat={lat} lng={lng} />;
}
