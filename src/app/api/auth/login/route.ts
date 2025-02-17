import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: Request) {
  try {
    const { loginOrEmail, password } = await req.json();

    const user = await prisma.user.findFirst({
      where: { OR: [{ login: loginOrEmail }, { email: loginOrEmail }] },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Неверный логин/пароль" }, { status: 401 });
    }

    const token = jwt.sign({ userLogin: user.login }, SECRET_KEY, { expiresIn: "7d" });

    return NextResponse.json({ message: "Вход выполнен", token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
