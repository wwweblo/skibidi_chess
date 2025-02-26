import express, { Application, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const prisma = new PrismaClient();
const app: Application = express(); // ✅ Объявляем `app` как `Application`
const server = http.createServer(app); // ✅ WebSocket сервер через HTTP
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ✅ Логируем все запросы для отладки
app.use((req, res, next) => {
  console.log(`📩 Запрос: ${req.method} ${req.url}`);
  next();
});

// ✅ Исправленный маршрут `/messages/:chatId`
app.get("/messages/:chatId", async (req: Request, res: Response): Promise<void> => {
  const chatId = Number(req.params.chatId);

  if (isNaN(chatId)) {
    res.status(400).json({ error: "❌ Неверный chatId" });
    return;
  }

  try {
    let chat = await prisma.chat.findUnique({ where: { id: chatId } });

    // ✅ Если чата нет, создаём новый
    if (!chat) {
      chat = await prisma.chat.create({
        data: { name: `Чат ${chatId}`, isGroup: false },
      });
      console.log(`✅ Новый чат создан: ${chat.id}`);
    }

    const messages = await prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (error) {
    console.error("❌ Ошибка сервера:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ✅ Проверочный API
app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "🚀 Сервер WebSocket работает!", websocket: "/socket.io/" });
});

// ✅ WebSocket сервер
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

io.on("connection", (socket) => {
  console.log(`✅ WebSocket: Пользователь подключился: ${socket.id}`);

  socket.on("message", (message) => {
    console.log("📩 WebSocket: Получено сообщение:", message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`❌ WebSocket: Пользователь отключился: ${socket.id}`);
  });
});

// ✅ Логируем маршруты при запуске
server.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`🚀 Сервер WebSocket и API запущен на http://localhost:${PORT}`);

    console.log("📌 Доступные маршруты:");
    app._router.stack
      .filter((r: any) => r.route)
      .forEach((r: any) => console.log(`➡️  ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`));
  } catch (error) {
    console.error("❌ Ошибка подключения к базе данных:", error);
    process.exit(1);
  }
});

app.post("/messages", async (req: Request, res: Response): Promise<void> => {
  console.log("📩 Получен POST запрос на /messages");
  console.log("📦 Тело запроса:", req.body);

  const { chatId, text, userLogin } = req.body;

  if (!chatId || !text || !userLogin) {
    console.error("❌ Ошибка: отсутствуют обязательные поля");
    res.status(400).json({ error: "❌ Все поля (chatId, text, userLogin) обязательны" });
    return;
  }

  try {
    // ✅ Проверяем, существует ли пользователь
    const userExists = await prisma.user.findUnique({ where: { login: userLogin } });

    if (!userExists) {
      console.error(`❌ Ошибка: Пользователь ${userLogin} не найден`);
      res.status(400).json({ error: "❌ Пользователь не найден" });
      return;
    }

    // ✅ Проверяем, существует ли чат
    let chat = await prisma.chat.findUnique({ where: { id: chatId } });

    if (!chat) {
      chat = await prisma.chat.create({
        data: { name: `Чат ${chatId}`, isGroup: false },
      });
      console.log(`✅ Новый чат создан: ${chat.id}`);
    }

    // ✅ Создаём сообщение (если пользователь и чат существуют)
    const message = await prisma.message.create({
      data: {
        chatId,
        text,
        userLogin,
        createdAt: new Date(),
      },
    });

    console.log(`📩 Новое сообщение в чате ${chatId}: ${text}`);

    res.status(201).json(message);
  } catch (error) {
    console.error("❌ Ошибка при отправке сообщения:", error);
    res.status(500).json({ error: "Ошибка сервера", details: error });
  }
});
