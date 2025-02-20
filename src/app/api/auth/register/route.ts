import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { login, email, password } = body;

    if (!login || !email || !password) {
      return NextResponse.json({ message: "Логин, email и пароль обязательны" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { login } });
    if (existingUser) {
      return NextResponse.json({ message: "Логин уже используется" }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ message: "Email уже зарегистрирован" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { login, email, password: hashedPassword },
    });

    const token = jwt.sign({ userLogin: newUser.login, userEmail: newUser.email }, SECRET_KEY!, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({ message: "Пользователь зарегистрирован" });
    response.headers.set("Set-Cookie", `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`);
    return response;
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
