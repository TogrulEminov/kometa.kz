import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { Role } from "../generated/prisma";
import { auth } from "../lib/admin/authOptions/auth";

export async function checkAuthorization(
  req: NextRequest,
  requiredRoles: Role[]
): Promise<{ user: Session["user"] | null; response: NextResponse | null }> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        user: null,
        response: NextResponse.json(
          { message: "Giriş edilməyib" },
          { status: 401 }
        ),
      };
    }

    const user = session.user;
    if (!requiredRoles.includes(user.role as Role)) {
      return {
        user: null,
        response: NextResponse.json(
          { message: "Bu əməliyyatı etməyə icazəniz yoxdur" },
          { status: 403 }
        ),
      };
    }

    return { user, response: null };
  } catch (error) {
    console.error("Authorization Check Error:", error);
    return {
      user: null,
      response: NextResponse.json(
        { message: "Daxili server xətası" },
        { status: 500 }
      ),
    };
  }
}

export async function checkAuthServerAction(
  requiredRoles: Role[]
): Promise<{ user: Session["user"] | null; error: string | null }> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        user: null,
        error: "Giriş edilməyib",
      };
    }

    const user = session.user;
    if (!requiredRoles.includes(user.role as Role)) {
      return {
        user: null,
        error: "Bu əməliyyatı etməyə icazəniz yoxdur",
      };
    }

    return { user, error: null };
  } catch (error) {
    console.error("Authorization Check Error:", error);
    return {
      user: null,
      error: "Daxili server xətası",
    };
  }
}
