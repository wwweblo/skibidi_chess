import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Пользователь подключился:", socket.id);

  socket.on("message", (msg) => {
    io.emit("message", msg); 
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился:", socket.id);
  });
});

server.listen(3001, () => console.log("WebSocket сервер запущен на порту 3001"));
