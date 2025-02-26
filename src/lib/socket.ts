import { io, Socket } from "socket.io-client";
import { fetchUser } from "./authApi";

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket | null> => {
  try {
    if (socket && socket.connected) {
      console.warn("⚠️ WebSocket уже подключен!", socket.id);
      return socket;
    }

    const user = await fetchUser();
    if (!user?.token) {
      console.error("❌ Ошибка: токен отсутствует!");
      return null;
    }

    console.log("🔌 Подключаем WebSocket с токеном:", user.token);

    socket = io("ws://localhost:3001", {
      auth: { token: user.token },
      withCredentials: true,
      transports: ["websocket"], // ✅ Только WebSocket
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket подключен: ID", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Ошибка подключения WebSocket:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ WebSocket отключен:", reason);
      socket = null;
    });

    return socket;
  } catch (error) {
    console.error("❌ Ошибка WebSocket:", error);
    return null;
  }
};

// ✅ Добавляем функцию отключения WebSocket
export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Отключаем WebSocket...");
    socket.disconnect();
    socket = null;
  }
};

// ✅ Функция отправки сообщения через WebSocket
export const sendMessageViaSocket = (message: { text: string; chatId: number }) => {
  if (socket && socket.connected) {
    socket.emit("message", message);
    console.log("📩 WebSocket: Сообщение отправлено", message);
  } else {
    console.warn("❌ WebSocket не подключен, сообщение не отправлено!");
  }
};
