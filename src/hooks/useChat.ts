import { useState, useEffect, useRef } from "react";
import { fetchMessages, sendMessage } from "@/lib/chatApi";
import { fetchUser } from "@/lib/authApi";
import { connectSocket, disconnectSocket, sendMessageViaSocket } from "@/lib/socket";
import { Message } from "@/types/message";

const useChat = (chatId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Функция прокрутки вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Инициализация чата и WebSocket
  useEffect(() => {
    const initChat = async () => {
      try {
        const user = await fetchUser();
        if (!user) throw new Error("Пользователь не авторизован");
        setUserLogin(user.userLogin);

        const messagesData = await fetchMessages(chatId);
        setMessages(messagesData);
      } catch (error) {
        console.error("Ошибка загрузки пользователя или сообщений:", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();

    const setupSocket = async () => {
      const ws = await connectSocket();
      if (!ws) return;
      if (socketRef.current) {
        console.warn("WebSocket уже подключен!");
        return;
      }
      socketRef.current = ws;

      ws.on("message", (message: Message) => {
        if (message.chatId === chatId) {
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === message.id)) return prev;
            return [...prev, message];
          });
        }
      });

      ws.on("disconnect", () => {
        console.log("WebSocket: Отключено");
        socketRef.current = null;
      });
    };

    setupSocket();

    return () => {
      disconnectSocket();
    };
  }, [chatId]);

  // Прокрутка вниз при обновлении сообщений
  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [messages, loading]);

  // Отправка сообщения
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userLogin || sending) {
      console.error("Ошибка: нет сообщения, пользователь не найден или идет отправка");
      return;
    }
    if (!chatId) {
      console.error("Ошибка: chatId отсутствует!");
      return;
    }
    setSending(true);
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
      const message = await sendMessage(newMessage, chatId, userLogin);
      if (!message) throw new Error("Сервер не вернул сообщение");

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempId).concat(
          prev.some((msg) => msg.id === message.id) ? [] : [message]
        )
      );
      sendMessageViaSocket(message);
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
    }

    setNewMessage("");
    setSending(false);
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    userLogin,
    loading,
    sending,
    messagesEndRef,
  };
};

export default useChat;
