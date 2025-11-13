import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "@/src/styles/globals.css";
import { MessageProvider } from "../globalElements/providers/MessageProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
const interSans = Inter({
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
const dmSans = DM_Sans({
  variable: "--font-dmsans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    template: "%s | Profi Transport - Ağır yükləriniz bizimlə yüngülləşir",
    default: "Profi Transport - Ağır yükləriniz bizimlə yüngülləşir",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: `${process.env.NEXT_PUBLIC_BASE_URL}/manifest.json`,
  alternates: {
    types: {
      "application/rss+xml": `${process.env.NEXT_PUBLIC_BASE_URL}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} ${dmSans.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <NextTopLoader
          color="#fff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />
        <AntdRegistry>
          <MessageProvider maxCount={5} duration={3} top={100}>
            {children}
          </MessageProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
