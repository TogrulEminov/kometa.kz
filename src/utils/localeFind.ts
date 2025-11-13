export type Locale = "az" | "en" | "ru";

const locales: Locale[] = ["az", "en", "ru"];

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}
