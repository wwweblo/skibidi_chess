import { io } from "socket.io-client";

export const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("✅ WebSocket подключен:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Ошибка подключения WebSocket:", err);
});
