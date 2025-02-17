import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) return NextResponse.json({ message: "Неавторизован" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET_KEY) as { userLogin: string };

    const message = await prisma.message.create({
      data: { text, userLogin: decoded.userLogin },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
