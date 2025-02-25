"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchUserProfile } from "@/lib/userApi"; // API для получения данных пользователя
import { Message } from "@/types/message";
import styles from "./UserProfile.module.css";

interface UserProfile {
  userLogin: string;
  userEmail: string;
  messages: Message[];
}

const UserPage = () => {
  const params = useParams(); // ✅ Получаем `params` как Promise
  const login = params?.login as string; // ✅ Разворачиваем login
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p className={styles.loading}>⏳ Загрузка профиля...</p>;
  if (error) return <p className={styles.error}>❌ {error}</p>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileTitle}>👤 Профиль {user?.userLogin}</h1>
      <p><strong>Email:</strong> {user?.userEmail}</p>

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
