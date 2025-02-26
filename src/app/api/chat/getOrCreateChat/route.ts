import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userLogin, targetLogin } = await req.json();

    console.log("📩 Запрос на создание чата:", { userLogin, targetLogin });

    if (!userLogin || !targetLogin) {
      console.error("❌ Ошибка: userLogin и targetLogin обязательны");
      return NextResponse.json({ error: "❌ userLogin и targetLogin обязательны" }, { status: 400 });
    }

    if (userLogin === targetLogin) {
      console.error("❌ Ошибка: Нельзя создать чат с самим собой");
      return NextResponse.json({ error: "❌ Нельзя создать чат с самим собой" }, { status: 400 });
    }

    // ✅ Проверяем, существуют ли пользователи
    const userExists = await prisma.user.findUnique({ where: { login: userLogin } });
    const targetUserExists = await prisma.user.findUnique({ where: { login: targetLogin } });

    if (!userExists || !targetUserExists) {
      console.error("❌ Ошибка: Один из пользователей не найден", { userExists, targetUserExists });
      return NextResponse.json({ error: "❌ Один из пользователей не найден" }, { status: 400 });
    }

    // ✅ Проверяем, существует ли чат между ЭТИМИ двумя пользователями
    let chat = await prisma.chat.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userLogin } } },
          { participants: { some: { userLogin: targetLogin } } },
        ],
      },
    });

    if (chat) {
      console.log(`🔄 Найден существующий чат: ${chat.id}`);
    } else {
      console.log("✅ Чат не найден, создаём новый");
      chat = await prisma.chat.create({
        data: {
          isGroup: false,
          participants: {
            create: [
              { user: { connect: { login: userLogin } } },
              { user: { connect: { login: targetLogin } } },
            ],
          },
        },
        include: { participants: true },
      });

      console.log(`✅ Новый чат создан: ${chat.id}`);
    }

    if (!chat) {
      console.error("❌ Ошибка: Чат не был создан!");
      return NextResponse.json({ error: "❌ Ошибка создания чата" }, { status: 500 });
    }

    console.log(`✅ Возвращаем chatId: ${chat.id}`);
    return NextResponse.json({ chatId: chat.id });

  } catch (error) {
    console.error("❌ Ошибка в API /api/chat/getOrCreateChat:", error);
    return NextResponse.json({ error: "Ошибка сервера", details: String(error) }, { status: 500 });
  }
}
