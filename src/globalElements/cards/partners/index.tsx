import Link from "next/link";
import React from "react";
import CustomImage from "../../ImageTag";
import { ConnectionItem, FileType } from "@/src/services/interface";
import { getForCards } from "@/src/utils/getFullimageUrl";
interface Props {
  item: ConnectionItem;
}
export default function PartnersCards({ item }: Props) {
  const { translations, imageUrl, url } = item;
  const { title } = translations?.[0];
  return (
    <>
      {url ? (
        <Link
          href={""}
          className=" bg-white transition-colors duration-200 hover:bg-[#f9f9f9] border border-ui-3 rounded-lg p-8 flex items-center justify-center"
        >
          <CustomImage
            width={150}
            height={40}
            className="max-w-[150px] h-[40] w-full  object-contain"
            title={title}
            src={getForCards(imageUrl as FileType)}
          />
        </Link>
      ) : (
        <figure className=" bg-white transition-colors duration-200 hover:bg-[#f9f9f9] border border-ui-3 rounded-lg p-8 flex items-center justify-center">
          <CustomImage
            width={150}
            height={60}
            className="max-w-[150px] max-h-[50px] w-full h-auto object-contain"
            title={title}
            src={getForCards(imageUrl as FileType)}
          />
        </figure>
      )}{" "}
    </>
  );
}
