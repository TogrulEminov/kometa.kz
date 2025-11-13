import React from "react";
import PartnersCards from "@/src/globalElements/cards/partners";
import { ConnectionItem } from "@/src/services/interface";
import NoData from "@/src/ui-components/essential/no-data";
interface Props {
  currentData: ConnectionItem[];
}
export default function ParntersDataContainer({ currentData }: Props) {
  if (!currentData?.length) {
    return <NoData />;
  }
  return (
    <section className="pb-10 lg:pb-15">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentData?.map((item, index) => {
            return <PartnersCards key={index} item={item as any} />;
          })}
        </div>
      </div>
    </section>
  );
}
