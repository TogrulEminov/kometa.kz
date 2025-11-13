import UnderConstructionPageContainer from "@/src/container/under-construction";
import { generatePageMetadata } from "@/src/utils/metadata";
import { Metadata } from "next";
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
export default function UnderConstructionPage() {
  return <UnderConstructionPageContainer />;
}
