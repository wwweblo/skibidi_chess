import express, { Application, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const prisma = new PrismaClient();
const app: Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware для CORS и JSON
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Middleware логирования всех запросов с телом запроса
app.use((req, res, next) => {
  console.log(`📩 Запрос: ${req.method} ${req.url}`);
  if (Object.keys(req.query).length) {
    console.log("🔍 Параметры запроса:", req.query);
  }
  if (req.body && Object.keys(req.body).length) {
    console.log("📦 Тело запроса:", req.body);
  }
  next();
});

// GET /messages/:chatId - получение сообщений чата, создание чата при отсутствии
app.get("/messages/:chatId", async (req: Request, res: Response): Promise<void> => {
  const chatId = Number(req.params.chatId);

  if (isNaN(chatId)) {
    res.status(400).json({ error: "❌ Неверный chatId" });
    return;
  }

  try {
    let chat = await prisma.chat.findUnique({ where: { id: chatId } });

    // Если чат не найден, создаём новый
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
    console.error("❌ Ошибка сервера (GET /messages):", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// GET /api/chat/access - проверка доступа к чату
app.get("/api/chat/access", async (req: Request, res: Response): Promise<void> => {
  const { chatId, userLogin } = req.query;

  if (!chatId || !userLogin) {
    console.error("❌ Отсутствуют обязательные параметры в /api/chat/access");
    res.status(400).json({ hasAccess: false, message: "Отсутствуют обязательные параметры" });
    return;
  }

  const chatIdNum = Number(chatId);
  const userLoginStr = String(userLogin);

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatIdNum },
      include: { participants: true },
    });

    if (!chat) {
      console.error(`❌ Чат с id ${chatIdNum} не найден`);
      res.status(404).json({ hasAccess: false, message: "Чат не найден" });
      return;
    }

    const hasAccess = chat.participants.some((participant) =>
      participant.userLogin.trim().toLowerCase() === userLoginStr.trim().toLowerCase()
    );

    console.log(`✅ Проверка доступа: chatId=${chatIdNum}, userLogin=${userLoginStr}, hasAccess=${hasAccess}`);
    res.json({ hasAccess });
  } catch (error) {
    console.error("❌ Ошибка проверки доступа к чату:", error);
    res.status(500).json({ hasAccess: false, message: "Ошибка сервера" });
  }
});

// GET / - тестовый маршрут
app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "🚀 Сервер WebSocket работает!", websocket: "/socket.io/" });
});

// POST /messages - создание нового сообщения
app.post("/messages", async (req: Request, res: Response): Promise<void> => {
  console.log("📩 Получен POST запрос на /messages");
  console.log("📦 Тело запроса:", req.body);

  const { chatId, text, userLogin } = req.body;

  if (!chatId || !text || !userLogin) {
    console.error("❌ Ошибка: отсутствуют обязательные поля в POST /messages");
    res.status(400).json({ error: "❌ Все поля (chatId, text, userLogin) обязательны" });
    return;
  }

  try {
    // Проверяем, существует ли пользователь
    const userExists = await prisma.user.findUnique({ where: { login: userLogin } });
    if (!userExists) {
      console.error(`❌ Ошибка: Пользователь ${userLogin} не найден`);
      res.status(400).json({ error: "❌ Пользователь не найден" });
      return;
    }

    // Проверяем, существует ли чат; если нет, создаём его
    let chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) {
      chat = await prisma.chat.create({
        data: { name: `Чат ${chatId}`, isGroup: false },
      });
      console.log(`✅ Новый чат создан: ${chat.id}`);
    }

    // Создаём сообщение с использованием фактического chat.id
    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        text,
        userLogin,
        createdAt: new Date(),
      },
    });

    console.log(`📩 Новое сообщение в чате ${chat.id}: ${text}`);
    res.status(201).json(message);
  } catch (error) {
    console.error("❌ Ошибка при отправке сообщения (POST /messages):", error);
    res.status(500).json({ error: "Ошибка сервера", details: error });
  }
});

// WebSocket сервер
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

// Запуск сервера
server.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`🚀 Сервер WebSocket и API запущен на http://localhost:${PORT}`);

    console.log("📌 Доступные маршруты:");
    app._router.stack
      .filter((r: any) => r.route)
      .forEach((r: any) => {
        console.log(`➡️  ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
      });
  } catch (error) {
    console.error("❌ Ошибка подключения к базе данных:", error);
    process.exit(1);
  }
});
