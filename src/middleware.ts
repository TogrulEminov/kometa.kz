// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

const i18nMiddleware = createMiddleware(routing);

// ✅ .env-dən oxu
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
const MAINTENANCE_SECRET_KEY =
  process.env.MAINTENANCE_SECRET_KEY || "secret123";
const MAINTENANCE_COOKIE_NAME = "maintenance_bypass";

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/manifest.json") ||
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/manage")) {
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, max-age=0, must-revalidate"
    );
    return response;
  }

  if (MAINTENANCE_MODE) {
    const bypassKey = searchParams.get("key");
    const bypassCookie = req.cookies.get(MAINTENANCE_COOKIE_NAME);

    if (bypassKey && bypassKey === MAINTENANCE_SECRET_KEY) {
      const targetUrl = req.nextUrl.clone();
      targetUrl.pathname = "/";
      targetUrl.search = "";

      const redirectResponse = NextResponse.redirect(targetUrl);

      redirectResponse.cookies.set(MAINTENANCE_COOKIE_NAME, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return redirectResponse;
    }

    if (bypassCookie?.value === "true") {
      return i18nMiddleware(req);
    }

    if (pathname === "/under-construction") {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = "/under-construction";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return i18nMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
