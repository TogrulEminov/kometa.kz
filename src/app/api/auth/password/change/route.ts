import { z, ZodError, ZodIssue } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/src/lib/admin/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/src/middleware/checkAuthorization";
import { Role } from "@/src/generated/prisma";

const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır")
      .nonempty("Yeni şifrə tələb olunur"),
    confirmPassword: z.string().nonempty("Təsdiq şifrəsi tələb olunur"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Yeni şifrələr üst-üstə düşmür",
        path: ["confirmPassword"],
      });
    }
  });

export async function POST(req: NextRequest) {
  const { user, response } = await checkAuthorization(req, [
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.CONTENT_MANAGER,
  ]);

  if (response) {
    return response;
  }
  try {
    // user obyekti checkAuthorization-dan gəlir
    if (!user || !user.id) {
      return NextResponse.json(
        { status: "failed", message: "İstifadəçi təyin edilməyib" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { password } = changePasswordSchema.parse(body);

    const dbUser = await db.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser || !dbUser.password) {
      return NextResponse.json(
        { status: "failed", message: "İstifadəçi tapılmadı" },
        { status: 404 }
      );
    }
    // Yeni şifrəni heşləyirik
    const newHashPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newHashPassword,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Şifrə uğurla dəyişdirildi",
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
    console.error("Change password error:", error);
    return NextResponse.json(
      { status: "failed", message: "Gözlənilməz xəta baş verdi" },
      { status: 500 }
    );
  }
}