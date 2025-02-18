import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  // 🛠 Извлекаем куки из запроса
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

  if (!token) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Недействительный токен" }, { status: 401 });
  }
}
