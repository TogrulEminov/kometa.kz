import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/admin/prismaClient";
import { Role } from "@/src/generated/prisma";
import { checkAuthorization } from "@/src/middleware/checkAuthorization";

export async function GET(req: NextRequest) {
  const { response } = await checkAuthorization(req, [Role.SUPER_ADMIN]);
  if (response) return response;

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
    },
  });

  return NextResponse.json(users);
}
