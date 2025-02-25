import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies(); // ✅ `cookies()` не требует `await`
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.warn("⚠️ API /me: Токен отсутствует в куках");
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    if (!decoded.userLogin) {
      return NextResponse.json({ message: "Ошибка авторизации" }, { status: 401 });
    }

    console.log("✅ API /me: Авторизован:", decoded.userLogin);

    return NextResponse.json({ user: decoded, token }); // ✅ Теперь API возвращает токен
  } catch (error) {
    console.error("❌ Ошибка API /me:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}

export async function fetchUser(): Promise<{ userLogin: string; token: string } | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });

    console.log("📡 API /me ответ:", res.status, await res.clone().json()); // ✅ Логируем ответ

    if (!res.ok) throw new Error(`❌ Ошибка авторизации: ${res.status}`);

    const data = await res.json();
    if (!data.user || !data.user.userLogin) throw new Error("❌ API не вернул userLogin");
    if (!data.token) throw new Error("❌ Токен отсутствует в ответе API");

    console.log("✅ Пользователь загружен:", data.user.userLogin);
    return { userLogin: data.user.userLogin, token: data.token };
  } catch (error) {
    console.error("❌ Ошибка получения пользователя:", error);
    return null;
  }
}
