import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { loginOrEmail, password } = body;

    if (!loginOrEmail || !password) {
      return NextResponse.json({ message: "Логин/Email и пароль обязательны" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ login: loginOrEmail }, { email: loginOrEmail }] },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Неверный логин/пароль" }, { status: 401 });
    }

    const token = jwt.sign({ userLogin: user.login, userEmail: user.email }, SECRET_KEY!, { expiresIn: "7d" });

    const response = NextResponse.json({ message: "Вход выполнен" });
    response.headers.set("Set-Cookie", `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`);
    return response;
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
