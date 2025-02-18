import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("❌ JWT_SECRET не найден в .env. Добавьте его в .env файл!");
}

export async function POST(req: Request) {
  try {
    const { loginOrEmail, password } = await req.json();

    // 🔍 Поиск пользователя по логину или email
    const user = await prisma.user.findFirst({
      where: { OR: [{ login: loginOrEmail }, { email: loginOrEmail }] },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Неверный логин/пароль" }, { status: 401 });
    }

    // 🔐 Создаём JWT
    const token = jwt.sign(
      { userLogin: user.login, userEmail: user.email },
      SECRET_KEY as string,
      { expiresIn: "7d" }
    );

    // 🍪 Устанавливаем токен в `httpOnly` cookie
    const cookie = serialize("token", token, {
      httpOnly: true, // ❌ Недоступен в JavaScript (защита от XSS)
      secure: process.env.NODE_ENV === "production", // 🔐 Только HTTPS в продакшене
      sameSite: "strict", // 🔥 Исправлено! Было "Strict", теперь "strict"
      path: "/", // 🍪 Доступен для всех роутов
      maxAge: 7 * 24 * 60 * 60, // ⏳ 7 дней
    });

    return NextResponse.json({ message: "Вход выполнен" }, { headers: { "Set-Cookie": cookie } });
  } catch (error) {
    console.error("❌ Ошибка входа:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
