"use client";
import React, { useCallback, useState, useEffect } from "react";
import { Select } from "antd";
import sortJson from "@/src/json/main/sort.json";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { CustomLocales } from "@/src/services/interface";

type OptionType = {
  value: string;
  label: string;
};

export default function FilterBarSelects() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedSort, setSelectedSort] = useState<string | undefined>(
    searchParams.get("sort") || undefined
  );

  // URL query parametrlərini update edən funksiya
  const updateQuery = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);

      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // URL-i yeniləyir (səhifə reload olmur)
      router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setSelectedSort(value);
      updateQuery("sort", value);
    },
    [updateQuery]
  );

  const handleClear = useCallback(() => {
    setSelectedSort(undefined);
    updateQuery("sort", null);
  }, [updateQuery]);

  // URL dəyişdikdə state-i sync et
  useEffect(() => {
    const sortParam = searchParams.get("sort");
    setSelectedSort(sortParam || undefined);
  }, [searchParams]);

  const sortOptions: OptionType[] =
    sortJson[locale as CustomLocales]?.map((item) => ({
      value: item.value,
      label: item.label,
    })) || [];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {t("select.sorting")}
      </label>
      <Select
        placeholder={t("select.main")}
        value={selectedSort}
        onChange={handleSortChange}
        onClear={handleClear}
        allowClear
        optionFilterProp="label"
        className="w-full"
        size="large"
        style={{ width: "100%" }}
        options={sortOptions}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
      />
    </div>
  );
}
