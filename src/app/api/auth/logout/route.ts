import { NextResponse } from "next/server";

export async function POST() {
  // 🍪 Удаляем токен, отправляя пустую куку с `Max-Age=0`
  const cookie = "token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict";

  return NextResponse.json({ message: "Выход выполнен" }, { headers: { "Set-Cookie": cookie } });
}
