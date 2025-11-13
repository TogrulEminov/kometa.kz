import React from "react";
import CustomImage from "../ImageTag";
import logoBlack from "@/public/assets/logo.png";
import { Link } from "@/src/i18n/navigation";

interface Props {
  width?: number;
  height?: number;
  isWhite?: boolean;
}
export default function Logo({ width, height, isWhite }: Props) {
  return (
    <Link href={"/" as any} className="w-40 xl:w-fit h-fit block">
      <CustomImage
        src={logoBlack}
        title="Logo"
        width={width ?? 100}
        className="object-contain"
        height={height ?? 70}
      />
    </Link>
  );
}
