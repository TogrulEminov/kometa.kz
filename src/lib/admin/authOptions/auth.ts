// lib/admin/authOptions/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/src/lib/admin/prismaClient";
import { authConfig } from "./auth.config";
import { Role } from "@/src/generated/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
    updateAge: 24 * 60 * 60, // 24 saat sonra session update et
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.loginIdentifier || !credentials?.password) {
          return null;
        }

        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: credentials.loginIdentifier as string },
              { username: credentials.loginIdentifier as string },
            ],
            isDeleted: false,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Sign in zamanı
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.username = user.username;
        token.lastChecked = Date.now(); // Son DB yoxlama vaxtı
        return token;
      }

      // Update trigger (profile update)
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      // CRITICAL FIX: DB yoxlamasını yalnız müəyyən intervalda et
      const now = Date.now();
      const lastChecked = (token.lastChecked as number) || 0;
      const checkInterval = 60 * 60 * 1000; // 1 saat (dəyişdirə bilərsiniz)

      // Əgər son yoxlamadan 1 saat keçməyibsə, DB-yə getmə
      if (now - lastChecked < checkInterval) {
        return token;
      }

      // 1 saatdan çox olubsa, DB-dən yoxla
      if (token.id) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: {
              isDeleted: true,
              role: true,
              name: true,
              email: true,
              username: true,
            },
          });

          // İstifadəçi silinib və ya tapılmayıb
          if (!dbUser || dbUser.isDeleted) {
            console.log("User deleted or not found:", token.id);
            // Token-i təmizlə - logout olacaq
            return {};
          }

          // Məlumatları update et
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.username = dbUser.username;
          token.lastChecked = now; // Yoxlama vaxtını yenilə

          console.log("User data refreshed from DB:", token.id);
        } catch (error) {
          console.error("Error checking user in DB:", error);
          // DB error olsa, mövcud token-i saxla
          return token;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Token boşdursa və ya id yoxdursa, session yoxdur
      if (!token || !token.id) {
        return null as any;
      }

      session.user.id = token.id as string;
      session.user.name = token.name ?? null;
      session.user.email = token.email as string;
      session.user.role = token.role as Role;
      session.user.username = token.username as string;

      return session;
    },
  },

  events: {
    async signOut(message) {
      if ("token" in message && message.token?.id) {
        console.log("User signed out:", message.token.id);
      }
    },
  },
});
