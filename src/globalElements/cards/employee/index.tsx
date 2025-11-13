import { Employee, FileType } from "@/src/services/interface";
import React from "react";
import CustomImage from "../../ImageTag";
import { getForCards } from "@/src/utils/getFullimageUrl";
interface Props {
  item: Employee;
}
export default function EmployeeCards({ item }: Props) {
  const { translations, imageUrl } = item;
  const { title, position } = translations?.[0];
  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="aspect-[3/4]">
          <CustomImage
            width={300}
            height={400}
            src={getForCards(imageUrl as FileType)}
            title={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center space-y-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            {/* {experience && (
              <div className="w-16 h-16 bg-ui-4 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl">
                {experience}
              </div>
            )} */}
            <div className="space-y-1">
              <h4 className="font-bold text-gray-900">{title}</h4>
              <p className="text-gray-600 text-sm flex items-center gap-x-2">
                <span className="w-2 h-2 bg-ui-4 rounded-full"></span>
                {position?.title}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 group-hover:opacity-0 transition-opacity duration-300">
          <div className="text-white space-y-1">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-gray-200 text-sm">{position?.title}</p>
            <div className="w-2 h-2 bg-ui-4 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
