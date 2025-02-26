import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface SessionData {
  user?: { login: string };
  token?: string;
}

export async function getSession(req: NextRequest): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.warn("⚠️ Ошибка: Токен отсутствует в куках");
      return null;
    }

    const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    if (!decoded.userLogin) {
      console.error("❌ Ошибка: JWT не содержит userLogin");
      return null;
    }

    console.log("✅ Авторизованный пользователь:", decoded.userLogin);
    return { user: { login: decoded.userLogin }, token };
  } catch (error) {
    console.error("❌ Ошибка декодирования JWT:", error);
    return null;
  }
}
