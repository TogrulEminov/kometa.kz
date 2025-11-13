import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
    updateAge: 24 * 60 * 60, // 24 saat
  },
  debug: process.env.NODE_ENV === "development",

  // Xüsusi JWT secret (production-da mütləq dəyişin)
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
