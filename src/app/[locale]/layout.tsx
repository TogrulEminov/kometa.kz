import { unstable_noStore as noStore } from "next/cache";
import "@ant-design/v5-patch-for-react-19";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import ProviderComponent from "./_provider";
interface LocalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}
export default async function LocalLayout({
  children,
  params,
}: LocalLayoutProps) {
  noStore();

  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });
  return (
    <>
      <NextIntlClientProvider messages={messages}>
        <ProviderComponent>{children}</ProviderComponent>
      </NextIntlClientProvider>
    </>
  );
}
