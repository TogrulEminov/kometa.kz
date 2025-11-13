// app/(dashboard)/auth/layout.tsx
import { auth } from "@/src/lib/admin/authOptions/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Əgər login-dirsə dashboard-a göndər
  if (session?.user) {
    redirect("/manage/dashboard");
  }

  return <>{children}</>;
}
