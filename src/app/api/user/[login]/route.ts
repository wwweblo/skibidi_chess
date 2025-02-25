import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { login: string } }) {
  try {
    const { login } = params;
    if (!login) return NextResponse.json({ message: "Логин не указан" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { login },
      select: {
        login: true,
        email: true,
        messages: {
          select: { id: true, text: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });

    return NextResponse.json({
      userLogin: user.login,
      userEmail: user.email,
      messages: user.messages,
    });
  } catch (error) {
    console.error("❌ Ошибка API профиля пользователя:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
