import Image, { StaticImageData } from "next/image";
import React, { FC } from "react";
import noImage from "@/public/assets/no-image.webp";

interface ImageProps {
  src?: string | StaticImageData;
  width: number;
  height: number;
  quality?: number;
  loading?: "eager" | "lazy";
  title: string | undefined;
  unoptimized?: boolean;
  className?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
}

const CustomImage: FC<ImageProps> = ({
  src,
  className,
  width,
  height,
  loading,
  quality = 75, // ✅ Default quality 75 (Google tövsiyəsi)
  unoptimized = true, // ✅ Default: optimizasiya aktiv
  title,
  fetchPriority,
  priority,
}) => {
  const imageLoading = priority ? undefined : loading;

  return (
    <Image
      className={className}
      title={title}
      src={src || noImage}
      priority={priority}
      alt={title ?? "custom"}
      width={width}
      height={height}
      quality={quality} // ✅ Quality aktiv
      loading={imageLoading}
      unoptimized={unoptimized}
      fetchPriority={fetchPriority}
    />
  );
};

export default CustomImage;
