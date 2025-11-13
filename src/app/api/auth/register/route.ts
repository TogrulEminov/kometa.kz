import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z, ZodIssue } from "zod";
import { db } from "@/src/lib/admin/prismaClient";
import { checkAuthorization } from "@/src/middleware/checkAuthorization";
import { Role } from "@/src/generated/prisma";
const registerSchema = z.object({
  name: z.string().nonempty("Ad tələb olunur"),
  username: z.string().nonempty("İstifadəçi adı tələb olunur"),
  email: z.string().email("Keçərsiz e-poçt").nonempty("E-poçt tələb olunur"),
  password: z
    .string()
    .min(6, "Şifrə ən azı 6 simvol olmalıdır")
    .nonempty("Şifrə tələb olunur"),
});

export async function POST(req: NextRequest) {
  const { user, response } = await checkAuthorization(req, [
    Role.SUPER_ADMIN,
  ]);

  if (response) {
    return response;
  }
  try {
    const body = await req.json();
    const { name, email, password, username } = body;

    await registerSchema.parse(body);
    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          status: "uğursuz",
          message: "E-poçt və ya istifadəçi adı artıq mövcuddur",
        },
        { status: 409 }
      );
    }
    const saltRounds = process.env.SALT ? Number(process.env.SALT) : 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await db.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    if (newUser) {
      return NextResponse.json(
        {
          status: "uğurlu",
          message:
            "İstifadəçi uğurla qeydiyyatdan keçdi. Zəhmət olmasa e-poçtunuzu yoxlayın.",
          data: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            name: newUser.name,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        status: "uğursuz",
        message: "Qeydiyyat mümkün olmadı, zəhmət olmasa yenidən cəhd edin.",
      },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Qeydiyyat xətası:", error);

    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue: ZodIssue) => ({
        path: issue.path.map(String).join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        {
          status: "uğursuz",
          message: "Doğrulama xətaları",
          errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          status: "uğursuz",
          message:
            error.message ||
            "Qeydiyyat mümkün olmadı, zəhmət olmasa daha sonra yenidən cəhd edin.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "uğursuz",
        message:
          "Gözlənilməz xəta baş verdi. Zəhmət olmasa, daha sonra yenidən cəhd edin.",
      },
      { status: 500 }
    );
  }
}
