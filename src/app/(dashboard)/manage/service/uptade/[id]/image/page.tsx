"use client";
import { useParams } from "next/navigation";
import { useServerQueryById } from "@/src/hooks/useServerActions";
import { ServicesItem } from "@/src/services/interface";

import { getServiceById } from "@/src/actions/client/service.actions";
import ServiceUpdateIcons from "./icons";
import ServiceUpdateImage from "./main";

export default function ServiceUpdateImagePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const getDataWrapper = async () => {
    const result = await getServiceById({
      locale: "az",
      id: id as string,
    });

    return {
      data: result.data as ServicesItem | undefined,
      message: result.message,
      code: result.code,
    };
  };

  const { data: existingData, refetch } = useServerQueryById<ServicesItem>(
    `service`,
    getDataWrapper,
    id,
    { locale: "az" }
  );
  return (
    <>
      <section className={"flex flex-col gap-4 mb-4.5"}>
        <ServiceUpdateImage data={existingData as any} refetch={refetch} />
        <ServiceUpdateIcons data={existingData as any} refetch={refetch} />
      </section>
    </>
  );
}
