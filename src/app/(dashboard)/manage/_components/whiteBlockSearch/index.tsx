"use client";
import React, { useState, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import languages from "@/src/json/main/language.json";
import dynamic from "next/dynamic";
import { Search, Globe, Filter } from "lucide-react";
const Popover = dynamic<any>(() => import("antd").then((m) => m.Popover), {
  ssr: false,
});
import Link from "next/link";

interface Props {
  link?: string;
  data?: any;
  exportBtn?: boolean;
  sort?: boolean;
}

const SearchingArea = ({ link, data, exportBtn = false, sort }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState<string>("");
  const hide = useCallback(() => setOpen(""), []);

  const locale = searchParams!.get("locale") ?? "az";
  const queryParams = searchParams!.get("query") ?? "";
  const [selectedSort, setSelectedSort] = useState<string>(
    searchParams!.get("sort") || ""
  );
  const [query, setQuery] = useState(queryParams);

  const setSearchParams = useCallback(
    (updater: (prevParams: URLSearchParams) => URLSearchParams) => {
      const current = new URLSearchParams(Array.from(searchParams!.entries()));
      const next = updater(current);
      router.replace(`${pathname}?${next.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const getLocaleHref = useCallback(
    (newLocale: string) => {
      const params = new URLSearchParams(Array.from(searchParams!.entries()));
      params.set("locale", newLocale);
      return `/${link}?${params.toString()}`;
    },
    [link, searchParams]
  );

  const handleRadioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSort = e.target.value;
      setSelectedSort(newSort);
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set("sort", newSort);
        return newParams;
      });
    },
    [setSearchParams]
  );

  const debouncedHandleChange = useMemo(
    () =>
      debounce((value: string) => {
        setSearchParams((prevParams) => {
          const newParams = new URLSearchParams(prevParams);
          if (value) {
            newParams.set("title", value);
          } else {
            newParams.delete("title");
          }
          return newParams;
        });
      }, 100),
    [setSearchParams]
  );

  const handleOpenChange = useCallback((title: string, open: boolean) => {
    setOpen(open ? title : "");
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      debouncedHandleChange(value);
    },
    [debouncedHandleChange]
  );

  return (
    <div className="flex items-center gap-2 mb-6 bg-gray-50 rounded-lg p-2">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          onChange={handleChange}
          value={query}
          name="title"
          placeholder="Axtar..."
          className="w-full bg-white rounded-lg pl-10 pr-4 h-10 text-sm outline-none font-poppins border border-gray-200 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Language Selector */}
      {link && languages && languages.length > 0 && (
        <Popover
          content={
            <div className="flex flex-col">
              {languages.map((item, index) => (
                <Link
                  href={getLocaleHref(item.code)}
                  onClick={hide}
                  key={index}
                  className={`px-4 py-2 text-sm font-medium hover:bg-gray-50 cursor-pointer ${
                    locale === item.code
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          }
          trigger="click"
          open={open === "language"}
          onOpenChange={(open: boolean) => handleOpenChange("language", open)}
        >
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-all"
          >
            <Globe className="w-4 h-4" />
          </button>
        </Popover>
      )}

      {/* Sort Button */}
      {sort && (
        <Popover
          content={
            <div className="flex flex-col">
              <button
                onClick={() => {
                  handleRadioChange({ target: { value: "desc" } } as any);
                  hide();
                }}
                className={`px-4 py-2 text-sm font-medium text-left hover:bg-gray-50 cursor-pointer ${
                  selectedSort === "desc"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700"
                }`}
              >
                Ən yeni
              </button>
              <button
                onClick={() => {
                  handleRadioChange({ target: { value: "asc" } } as any);
                  hide();
                }}
                className={`px-4 py-2 text-sm font-medium text-left hover:bg-gray-50 cursor-pointer ${
                  selectedSort === "asc"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700"
                }`}
              >
                Ən köhnə
              </button>
            </div>
          }
          trigger="click"
          open={open === "filter"}
          onOpenChange={(open: boolean) => handleOpenChange("filter", open)}
        >
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-all"
          >
            <Filter className="w-4 h-4" />
          </button>
        </Popover>
      )}
    </div>
  );
};

export default React.memo(SearchingArea);
