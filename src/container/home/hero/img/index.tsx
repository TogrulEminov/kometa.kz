"use client";
import CustomImage from "@/src/globalElements/ImageTag";
import { FileType } from "@/src/services/interface";
import { getForCards } from "@/src/utils/getFullimageUrl";
import React from "react";

interface Props {
  img?: FileType;
}

export default function HeroImg({ img }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {img && (
        <div className="relative w-full h-full group">
          <div className="w-full h-full hero-kenburns">
            <CustomImage
              title="hero"
              width={1920}
              height={1080}
              priority={true}
              unoptimized={false}
              src={getForCards(img as FileType)}
              className="w-full h-full lg:object-center object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-ui-1/50 via-ui-1/20 to-transparent"></div>

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-purple-400/0 to-blue-400/0 hero-glow"></div>
        </div>
      )}
    </div>
  );
}
