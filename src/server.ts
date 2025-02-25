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

// Храним список активных пользователей
const activeUsers = new Set<string>();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  console.log("🔍 WebSocket: Получен токен:", token);
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key") as JwtPayload;
    console.log("🔑 WebSocket: Декодированный токен:", decoded);

    if (!decoded.userLogin) return next(new Error("Unauthorized"));

    socket.data.user = decoded.userLogin;
    next();
  } catch (error) {
    console.error("❌ WebSocket: Ошибка валидации токена", error);
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const userLogin = socket.data.user;

  if (activeUsers.has(userLogin)) {
    console.warn(`⚠️ Пользователь уже подключен: ${userLogin}`);
    socket.disconnect(); // ❌ Отключаем повторное подключение
    return;
  }

  activeUsers.add(userLogin);
  console.log("✅ WebSocket: Пользователь подключен:", userLogin);
  console.log("👥 Активные пользователи:", Array.from(activeUsers));

  socket.on("disconnect", () => {
    activeUsers.delete(userLogin);
    console.log("❌ WebSocket: Пользователь отключился:", userLogin);
    console.log("👥 Активные пользователи после отключения:", Array.from(activeUsers));
  });
});

server.listen(3001, () => console.log("🚀 WebSocket сервер запущен на порту 3001"));
