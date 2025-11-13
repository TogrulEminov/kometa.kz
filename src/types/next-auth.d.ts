// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { Role } from "@/src/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      username: string;
      email: string;
      name: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    username: string;
    email: string;
    name: string | null;
    isDeleted?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    username?: string;
    email?: string;
    name?: string | null;
    dbSessionId?: string;
    sessionToken?: string;
    sessionExpiry?: number;
  }
}
