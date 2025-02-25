import { io, Socket } from "socket.io-client";
import { fetchUser } from "./authApi";

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket | null> => {
  try {
    if (socket && socket.connected) {
      console.warn("⚠️ WebSocket уже подключен!");
      return socket;
    }

    const user = await fetchUser();
    if (!user || !user.token) throw new Error("❌ Ошибка: токен отсутствует в ответе API");

    console.log("✅ WebSocket: Подключаемся с токеном:", user.token);

    socket = io("http://localhost:3001", {
      auth: { token: user.token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket: Подключено, ID:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Ошибка WebSocket:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ WebSocket: Отключено, причина:", reason);
      socket = null; // ✅ Очищаем сокет
    });

    return socket;
  } catch (error) {
    console.error("❌ Ошибка подключения WebSocket:", error);
    return null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Отключение WebSocket...");
    socket.disconnect();
    socket = null;
  }
};
