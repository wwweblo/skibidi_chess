"use client";

import { useEffect, useState } from "react";
import { fetchMessages, sendMessage } from "@/lib/api";
import { socket } from "@/lib/socket";
import { Message } from "@/types/message";
import styles from "./Chat.module.css";

// 🛠 Функция для получения куки по имени
const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userLogin, setUserLogin] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie("token"); // 🍪 Теперь токен берём из cookie
    if (!token) return;

    fetchMessages().then(setMessages);

    socket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserLogin(decodedToken.userLogin);
    } catch (error) {
      console.error("❌ Ошибка декодирования токена:", error);
    }

    return () => {
      socket.off("message");
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userLogin) return;

    const token = getCookie("token") || ""; // 🍪 Получаем токен из куки

    const message = await sendMessage(newMessage, token);
    if (message) {
      socket.emit("message", message);
      setNewMessage("");
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h2 className={styles.chatTitle}>Чат</h2>

      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.userLogin === userLogin ? styles.myMessage : styles.otherMessage
            }`}
          >
            <span className="font-bold">{msg.userLogin}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
          className={styles.inputField}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;
