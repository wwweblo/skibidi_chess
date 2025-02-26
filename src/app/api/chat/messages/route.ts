import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("📩 API /chat/messages: Получен запрос");

    // 🔹 Проверяем соединение с БД
    await prisma.$connect();

    // 🔹 Загружаем сообщения
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "asc" },
    });

    console.log("✅ API /chat/messages: Загружены сообщения:", messages.length);
    return NextResponse.json(messages);
  } catch (error) {
    console.error("❌ API /chat/messages: Ошибка сервера:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
