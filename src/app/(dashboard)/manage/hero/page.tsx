"use client";
import React from "react";
import data from "@/src/json/main/language.json";
import { useRouter, useSearchParams } from "next/navigation";
import { useServerQuery } from "@/src/hooks/useServerActions";
import { getHero } from "@/src/actions/client/hero.actions";
import { CustomLocales } from "@/src/services/interface";
import Content from "../hero/_components/content";
import Image from "../hero/_components/image";
export default function HeroPage() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();
  const handleLocaleChange = (newLocale: string) => {
    const params = new URLSearchParams(
      Array.from(searchParams?.entries() || [])
    );
    params.set("locale", newLocale);
    router.replace(`?${params.toString()}`);
  };
  const { data: heroData, refetch } = useServerQuery("hero", getHero, {
    params: {
      locale: locale as CustomLocales,
    },
  });
  return (
    <section className={"flex flex-col gap-4 mb-4.5"}>
      <h1 className="text-3xl font-inter font-bold text-ui-1 mb-5">
        Giriş bölməsi
      </h1>
      <div className="grid grid-cols-3 max-w-lg mb-4 p-2.5 rounded-lg w-full bg-gray-50">
        {data?.map((item, index) => {
          return (
            <button
              type="button"
              key={index}
              aria-label={`change language to ${item.title}`}
              className={`${
                item.code === locale
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-ui-1"
              } h-10 flex items-center cursor-pointer justify-center rounded-md w-full`}
              onClick={() => handleLocaleChange(item.code)}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      <Content existingData={heroData?.data as any} refetch={refetch} />
      <Image existingData={heroData?.data as any} refetch={refetch} />
    </section>
  );
}
