"use client";

import { useParams } from "next/navigation";
import Chat from "@/components/Chat/Chat";

const ChatPage = () => {
  const params = useParams();
  const chatId = Number(params?.chatId);

  if (!chatId) {
    return <p className="text-center text-red-500">❌ Ошибка: Неверный ID чата</p>;
  }

  return <Chat chatId={chatId} />;
};

export default ChatPage;
