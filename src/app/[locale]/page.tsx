import { Metadata } from "next";
import HomePageContainer from "../../container/home";
import { generatePageMetadata } from "@/src/utils/metadata";
import { getHome } from "@/src/actions/ui/home.actions";
import { CustomLocales } from "@/src/services/interface";
interface PageProps {
  params: Promise<{ locale: string }>;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale: locale,
    customPath: "home",
    dataType: "category",
    detail: false,
  });
}
export const dynamic = "force-dynamic";
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const homeData = await getHome({
    locale: locale as CustomLocales,
  });

  return <HomePageContainer data={homeData as any} />;
}
