import { z, ZodError, ZodIssue } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/src/lib/admin/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/src/middleware/checkAuthorization";
import { Role } from "@/src/generated/prisma";

const generatePasswordSchema = z.object({
  userId: z.string().nonempty("İstifadəçi ID tələb olunur"),
  newPassword: z
    .string()
    .min(6, "Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır"),
});

export async function PATCH(req: NextRequest) {
  const { user: adminUser, response } = await checkAuthorization(req, [
    Role.SUPER_ADMIN,
  ]);

  if (response) {
    return response;
  }

  try {
    const body = await req.json();
    const { userId, newPassword } = generatePasswordSchema.parse(body);
    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { status: "failed", message: "Hədəf istifadəçi tapılmadı" },
        { status: 404 }
      );
    }

    if (
      targetUser.role === Role.SUPER_ADMIN &&
      targetUser.id !== adminUser?.id
    ) {
      return NextResponse.json(
        {
          status: "failed",
          message: "Başqa bir Super Admin-in şifrəsini dəyişə bilməzsiniz.",
        },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      {
        status: "success",
        message: `'${
          targetUser.name || targetUser.username
        }' adlı istifadəçinin şifrəsi uğurla yeniləndi`,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue: ZodIssue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { status: "failed", message: "Validation xətaları", errors },
        { status: 400 }
      );
    }
    console.error("Generate password error:", error);
    return NextResponse.json(
      { status: "failed", message: "Gözlənilməz xəta baş verdi" },
      { status: 500 }
    );
  }
}
