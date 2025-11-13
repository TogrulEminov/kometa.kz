import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/admin/prismaClient";
import { Role } from "@/src/generated/prisma";
import { checkAuthorization } from "@/src/middleware/checkAuthorization";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await checkAuthorization(req, [Role.SUPER_ADMIN]);
  if (response) return response;

  try {
    const { id } = await params;

    // İstifadəçinin mövcudluğunu yoxla
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "İstifadəçi tapılmadı" },
        { status: 404 }
      );
    }

    // SUPER_ADMIN-ı silməyə icazə vermə
    if (user.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "SUPER_ADMIN istifadəçisini silmək mümkün deyil" },
        { status: 403 }
      );
    }

    // İstifadəçini sil
    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `${user.name || "İstifadəçi"} uğurla silindi`,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "İstifadəçi silinərkən xəta baş verdi" },
      { status: 500 }
    );
  }
}
