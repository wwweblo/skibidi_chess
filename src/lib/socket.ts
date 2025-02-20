import { io, Socket } from "socket.io-client";
import { fetchUser } from "@/lib/authApi";

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket | null> => {
  try {
    if (socket) return socket; // ✅ Если уже подключены, не подключаем повторно

    const user = await fetchUser();
    if (!user || !user.token) throw new Error("❌ Ошибка: пользователь не найден или отсутствует токен");

    console.log("📡 Подключение к WebSocket с токеном:", user.token); // ✅ Логируем перед подключением

    socket = io("http://localhost:3001", {
      auth: { token: user.token }, // ✅ Передаем токен в WebSocket
      withCredentials: true, // ✅ Используем cookies
    });

    socket.on("connect", () => console.log("✅ WebSocket подключен:", socket?.id));
    socket.on("disconnect", () => console.log("❌ WebSocket отключен"));

    return socket;
  } catch (error) {
    console.error("❌ Ошибка подключения WebSocket:", error);
    return null;
  }
};
