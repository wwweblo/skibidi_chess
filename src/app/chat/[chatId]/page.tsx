"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Chat from "@/components/Chat/Chat";
import { fetchUser } from "@/lib/authApi";
import { checkChatAccess } from "@/lib/chatApi";
import { Alert } from "@/components/Alert/Alert";

const ChatPage = () => {
  const params = useParams();
  const router = useRouter();
  const chatId = Number(params?.chatId);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!chatId) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const user = await fetchUser();
        if (!user) throw new Error("❌ Пользователь не авторизован");

        const isParticipant = await checkChatAccess(chatId, user.userLogin);
        setHasAccess(isParticipant);
      } catch (error) {
        console.error("❌ Ошибка проверки доступа к чату:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [chatId]);

  if (loading) return <p className="text-center">⏳ Проверка доступа...</p>;

  if (!chatId || hasAccess === false) {
    return <Alert text="😡 Нет доступа к чату"></Alert>
  }

  return <Chat chatId={chatId} />;
};

export default ChatPage;
