// app/manifest.json/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const manifest = {
    short_name: "Profi Transport",
    name: "Profi Transport | Logistika və Yük Daşınması Xidmətləri",
    description:
      "Profi Transport, qruppaj yüklərin daşınması, ağır texnikaların daşınması, quru yol və dəmir yol daşınması xidmətləri ilə peşəkar logistika təmin edir.",
    start_url: "/",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    background_color: "#1a1a1a",
    theme_color: "#0066cc",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    lang: "az",
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
