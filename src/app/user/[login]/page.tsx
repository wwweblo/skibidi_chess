"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchUserProfile, getOrCreateChat, fetchUser} from "@/lib/userApi"; // Добавлен API для чатов
import { Message } from "@/types/message";
import styles from "./UserProfile.module.css";
import { Alert } from "@/components/Alert/Alert";

interface UserProfile {
  userLogin: string;
  userEmail: string;
  messages: Message[];
}

const UserPage = () => {
  const params = useParams();
  const login = params?.login as string;
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!login) return;

    const loadUser = async () => {
      try {
        const userData = await fetchUserProfile(login);
        if (!userData) throw new Error("Пользователь не найден");
        setUser(userData);
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки профиля");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [login]);

  const handleOpenChat = async () => {
    if (!user) return;
  
    try {
      // ✅ Получаем текущего авторизованного пользователя
      const currentUser = await fetchUser();
      if (!currentUser || !currentUser.userLogin) {
        console.error("❌ Ошибка: Не удалось получить текущего пользователя");
        return;
      }
  
      console.log(`📡 Открытие чата между ${currentUser.userLogin} и ${user.userLogin}`);
  
      // ✅ Передаём корректный `userLogin`
      const chatId = await getOrCreateChat(currentUser.userLogin, user.userLogin);
      if (!chatId) throw new Error("Ошибка создания или поиска чата");
  
      console.log(`✅ Переход в чат ${chatId}`);
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error("❌ Ошибка при открытии чата:", error);
      setError("Не удалось открыть чат");
    }
  };
  
  if (loading) return   <Alert text="⏳ Загрузка профиля..."/>;
  if (error)   return   <Alert text={`❌ ${error}`}/>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileTitle}>👤 Профиль {user?.userLogin}</h1>
      <p><strong>Email:</strong> {user?.userEmail}</p>

      <button className={styles.chatButton} onClick={handleOpenChat} disabled={chatLoading}>
        {chatLoading ? "🔄 Открытие чата..." : "💬 Открыть чат"}
      </button>

      <h2 className={styles.messagesTitle}>💬 Сообщения:</h2>
      {user?.messages.length ? (
        <ul className={styles.messagesList}>
          {user.messages.map((msg) => (
            <li key={msg.id} className={styles.messageItem}>
              {msg.text}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noMessages}>😶 У пользователя пока нет сообщений</p>
      )}
    </div>
  );
};

export default UserPage;
