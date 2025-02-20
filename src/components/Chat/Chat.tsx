"use client";

import { useEffect, useState, useRef } from "react";
import { fetchMessages, sendMessage } from "@/lib/chatApi";
import { fetchUser } from "@/lib/authApi";
import { connectSocket } from "@/lib/socket";
import { Message } from "@/types/message";
import styles from "./Chat.module.css";
import Button from "@/components/Button/Button";
import TextBox from "@/components/TextBox/TextBox";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // ✅ Ссылка на конец списка сообщений

  // 🔹 Прокрутка вниз при загрузке сообщений или их обновлении
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initChat = async () => {
      try {
        const user = await fetchUser();
        if (!user) throw new Error("❌ Пользователь не авторизован");

        setUserLogin(user.userLogin);

        const messagesData = await fetchMessages();
        setMessages(messagesData);
        setTimeout(scrollToBottom, 100); // ✅ Прокрутка после загрузки
      } catch (error) {
        console.error("❌ Ошибка загрузки пользователя или сообщений:", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();

    connectSocket().then((ws) => {
      if (!ws) return;
      setSocket(ws);

      ws.on("message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
        setTimeout(scrollToBottom, 50); // ✅ Прокрутка при новом сообщении
      });

      return () => {
        ws.off("message");
        ws.disconnect();
      };
    });
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userLogin) {
      console.error("❌ Ошибка: нет сообщения или пользователь не найден");
      return;
    }

    const tempMessage: Message = { id: Date.now(), text: newMessage, userLogin };
    setMessages((prev) => [...prev, tempMessage]);
    setTimeout(scrollToBottom, 50); // ✅ Прокрутка при отправке нового сообщения

    try {
      const message = await sendMessage(newMessage);
      if (!message) throw new Error("❌ Сервер не вернул сообщение");

      setMessages((prev) => prev.map((msg) => (msg.id === tempMessage.id ? message : msg)));
      socket?.emit("message", message);
    } catch (error) {
      console.error("❌ Ошибка отправки сообщения:", error);
    }

    setNewMessage("");
  };

  return (
    <div className={styles.chatContainer}>
      <h2 className={styles.chatTitle}>Чат</h2>

      {loading ? (
        <p className="text-center">Загрузка сообщений...</p>
      ) : (
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
          <div ref={messagesEndRef} /> {/* ✅ Скрытый элемент для прокрутки вниз */}
        </div>
      )}

      <div className={styles.inputContainer}>
        <TextBox
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <Button variant="agree" size="middle" onClick={handleSendMessage}>
          Send 🚀
        </Button>
      </div>
    </div>
  );
};

export default Chat;
