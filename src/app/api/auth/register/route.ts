import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    console.log("🔍 Получен запрос на регистрацию");

    const body = await req.json();
    console.log("📩 Полученные данные:", body);

    const { login, email, password } = body;

    if (!login || !email || !password) {
      console.log("⚠️ Ошибка: Логин, email и пароль обязательны");
      return NextResponse.json({ message: "Логин, email и пароль обязательны" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { login } });
    if (existingUser) {
      console.log("⚠️ Ошибка: Логин уже используется");
      return NextResponse.json({ message: "Логин уже используется" }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      console.log("⚠️ Ошибка: Email уже зарегистрирован");
      return NextResponse.json({ message: "Email уже зарегистрирован" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Пароль захеширован");

    const newUser = await prisma.user.create({
      data: { login, email, password: hashedPassword },
    });

    console.log("✅ Пользователь создан:", newUser);

    return NextResponse.json({ message: "Пользователь зарегистрирован" }, { status: 201 });
  } catch (error) {
    console.error("❌ Ошибка сервера:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
