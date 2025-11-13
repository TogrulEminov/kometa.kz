import { auth } from "@/src/lib/admin/authOptions/auth";
import DashboardProvider from "../_provider";
import Header from "./_components/header";
import Sidebar from "./_components/sidebar";
import WhiteBlock from "./_components/whiteBlock";
import { redirect } from "next/navigation";

export default async function AdminDashboarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // Session yoxdursa login-ə göndər
  if (!session?.user) {
    redirect("/auth/login");
  }
  return (
    <DashboardProvider session={session}>
      <Header />
      <main className={"min-h-dvh bg-[#e8e8e8] pt-20 pb-5 overflow-hidden"}>
        <Sidebar />
        <WhiteBlock>{children}</WhiteBlock>
      </main>
    </DashboardProvider>
  );
}
