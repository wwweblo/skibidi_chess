import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; 

export async function GET() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const SECRET_KEY = process.env.JWT_SECRET;
  if (!SECRET_KEY) {
    return NextResponse.json({ message: "Ошибка сервера: секретный ключ не найден" }, { status: 500 });
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при проверке токена:", error);
    return NextResponse.json({ message: "Недействительный токен" }, { status: 401 });
  }
}
