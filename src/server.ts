import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

// 🔹 Middleware для проверки токена перед подключением
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  console.log("🔍 WebSocket: Получен токен:", token); // ✅ Теперь логируем токен на сервере

  if (!token) {
    console.warn("⚠️ WebSocket: Попытка подключения без токена");
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key") as JwtPayload;
    
    console.log("🔑 WebSocket: Декодированный токен:", decoded); // ✅ Логируем декодированный токен

    if (!decoded.userLogin) {
      console.error("❌ WebSocket: Токен не содержит userLogin");
      return next(new Error("Unauthorized"));
    }

    socket.data.user = decoded.userLogin;
    next();
  } catch (error) {
    console.error("❌ WebSocket: Ошибка валидации токена", error);
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("✅ WebSocket: Пользователь подключен:", socket.data.user);

  socket.on("message", async (msg) => {
    try {
      if (!msg.text?.trim()) return; // ✅ Игнорируем пустые сообщения

      const savedMessage = await prisma.message.create({
        data: {
          text: msg.text,
          userLogin: socket.data.user,
          createdAt: new Date(),
        },
      });

      io.emit("message", savedMessage);
    } catch (error) {
      console.error("❌ Ошибка сохранения сообщения в БД:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ WebSocket: Пользователь отключился:", socket.data.user);
  });
});

server.listen(3001, () => console.log("🚀 WebSocket сервер запущен на порту 3001"));
