import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);

    if (!session || !session.user) {
      console.warn("❌ Ошибка: Пользователь не авторизован");
      return NextResponse.json({ error: "Пользователь не авторизован" }, { status: 401 });
    }

    console.log(`✅ Пользователь найден: ${session.user.login}`);
    return NextResponse.json({ userLogin: session.user.login, token: session.token });
  } catch (error) {
    console.error("❌ Ошибка в API /api/auth/user:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
