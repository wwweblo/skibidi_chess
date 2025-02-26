import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    console.log("📩 API /chat/send: Получен запрос");

    // 🔹 Получаем токен из cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      console.warn("⚠️ API /chat/send: Токен отсутствует в куках");
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    // 🔹 Проверяем секретный ключ
    const SECRET_KEY = process.env.JWT_SECRET;
    if (!SECRET_KEY) {
      console.error("❌ Ошибка: JWT_SECRET не задан в .env!");
      return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }

    // 🔹 Декодируем JWT
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    if (!decoded.userLogin) {
      return NextResponse.json({ message: "Ошибка авторизации" }, { status: 401 });
    }

    console.log("✅ API /chat/send: Авторизован как", decoded.userLogin);

    // 🔹 Получаем данные из запроса
    const body = await req.json();
    console.log("📨 Данные запроса:", body);

    const { text, chatId } = body;

    // 🔹 Валидация данных
    if (!text || !text.trim()) {
      return NextResponse.json({ message: "Сообщение не может быть пустым" }, { status: 400 });
    }

    if (!chatId || typeof chatId !== "number") {
      return NextResponse.json({ message: "Ошибка: chatId должен быть числом" }, { status: 400 });
    }

    console.log("📨 API /chat/send: Сохранение сообщения...", { text, chatId });

    // 🔹 Проверяем соединение с БД
    await prisma.$connect();

    // 🔹 Сохраняем сообщение в БД
    const newMessage = await prisma.message.create({
      data: {
        text,
        userLogin: decoded.userLogin,
        chatId,
        createdAt: new Date(), // ✅ Передаём Date вместо строки
      },
    });

    console.log("✅ API /chat/send: Сообщение сохранено:", newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("❌ API /chat/send: Ошибка сервера:", error);
    return NextResponse.json({ message: "Ошибка сервера", error: String(error) }, { status: 500 });
  }
}
