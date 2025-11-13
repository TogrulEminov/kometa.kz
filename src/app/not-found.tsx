"use client";

import { usePathname } from "next/navigation";
import NotFoundContainer from "../container/notfound";

export default function NotFound() {
  const pathname = usePathname();

  // URL-dən locale götür (məsələn: /en/about → "en")
  const locale = pathname?.split("/")[1] as "az" | "en" | "ru";

  // Validate
  const validLocale = ["az", "en", "ru"].includes(locale) ? locale : "az";

  return <NotFoundContainer locale={validLocale} />;
}
