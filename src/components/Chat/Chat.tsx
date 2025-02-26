"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchMessages, sendMessage } from "@/lib/chatApi";
import { fetchUser } from "@/lib/authApi";
import { connectSocket, disconnectSocket, sendMessageViaSocket } from "@/lib/socket";
import { Message } from "@/types/message";
import styles from "./Chat.module.css";
import Button from "@/components/Button/Button";
import TextBox from "@/components/TextBox/TextBox";

interface ChatProps {
  chatId: number;
}

const Chat: React.FC<ChatProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);
  const router = useRouter();

  // ✅ Функция прокрутки чата вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Инициализация чата и WebSocket
  useEffect(() => {
    const initChat = async () => {
      try {
        const user = await fetchUser();
        if (!user) throw new Error("❌ Пользователь не авторизован");

        setUserLogin(user.userLogin);
        console.log("✅ Установлен userLogin:", user.userLogin);

        const messagesData = await fetchMessages(chatId);
        setMessages(messagesData);
      } catch (error) {
        console.error("❌ Ошибка загрузки пользователя или сообщений:", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();

    const setupSocket = async () => {
      const ws = await connectSocket();
      if (!ws) return;

      if (socketRef.current) {
        console.warn("⚠️ WebSocket уже подключен!");
        return;
      }

      socketRef.current = ws;

      ws.on("message", (message: Message) => {
        if (message.chatId === chatId) {
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === message.id)) return prev; // ✅ Проверка на дубликаты
            return [...prev, message];
          });
        }
      });

      ws.on("disconnect", () => {
        console.log("❌ WebSocket: Отключено");
        socketRef.current = null;
      });
    };

    setupSocket();

    return () => {
      disconnectSocket();
    };
  }, [chatId]);

  // ✅ Прокрутка чата вниз при обновлении сообщений
  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [messages]);

  // ✅ Отправка сообщения
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userLogin || sending) {
      console.error("❌ Ошибка: нет сообщения, пользователь не найден или идет отправка");
      return;
    }

    console.log("📡 handleSendMessage: chatId перед отправкой:", chatId);

    if (!chatId) {
      console.error("❌ Ошибка: chatId отсутствует в handleSendMessage!");
      return;
    }

    const tempId = Date.now();
    const tempMessage: Message = {
      id: tempId,
      text: newMessage,
      userLogin,
      chatId,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const message = await sendMessage(newMessage, chatId, userLogin); // ✅ Передаем userLogin
      if (!message) throw new Error("❌ Сервер не вернул сообщение");

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== tempId)
          .concat(prev.some((msg) => msg.id === message.id) ? [] : [message])
      );

      sendMessageViaSocket(message);
    } catch (error) {
      console.error("❌ Ошибка отправки сообщения:", error);
    }

    setNewMessage("");
    setSending(false);
  };

  // ✅ Функция перехода в профиль пользователя
  const goToUserProfile = (login: string) => {
    router.push(`/user/${login}`);
  };

  return (
    <div className={styles.chatContainer}>
      <h2 className={styles.chatTitle}>💬 Чат {chatId}</h2>

      {loading ? (
        <p className="text-center">⏳ Загрузка сообщений...</p>
      ) : (
        <div className={styles.messagesContainer}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.userLogin === userLogin ? styles.myMessage : styles.otherMessage
              }`}
            >
              <span className={styles.link} onClick={() => goToUserProfile(msg.userLogin)}>
                {msg.userLogin}:
              </span>
              <span> {msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className={styles.inputContainer}>
        <TextBox
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <Button variant="agree" size="middle" onClick={handleSendMessage} disabled={!newMessage.trim() || sending}>
          {sending ? "Отправка..." : "Отправить 🚀"}
        </Button>
      </div>
    </div>
  );
};

export default Chat;
