import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 🔹 Получаем токен из cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    // 🔹 Декодируем JWT
    const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    if (!decoded.userLogin) {
      return NextResponse.json({ message: "Ошибка авторизации" }, { status: 401 });
    }

    // 🔹 Получаем текст сообщения
    const { text } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ message: "Сообщение не может быть пустым" }, { status: 400 });
    }

    // 🔹 Сохраняем сообщение в базу данных
    const newMessage = await prisma.message.create({
      data: {
        text,
        userLogin: decoded.userLogin,
        createdAt: new Date(),
      },
    });

    console.log("✅ Сообщение сохранено:", newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("❌ Ошибка сохранения сообщения:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
