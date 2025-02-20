"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/Button/Button";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ login: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
  
        if (!res.ok) {
          console.error(`❌ Ошибка авторизации: ${res.status} ${res.statusText}`);
          throw new Error("Не авторизован");
        }
  
        const data = await res.json();
        if (!data.user || !data.user.userLogin || !data.user.userEmail) {
          console.error("❌ Некорректный ответ API:", data);
          throw new Error("Ошибка получения данных пользователя");
        }
  
        setUser({ login: data.user.userLogin, email: data.user.userEmail });
      } catch (error) {
        console.error("❌ Ошибка загрузки пользователя:", error);
        router.push("/user/login");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [router]);
  

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/user/login");
      } else {
        console.error("❌ Ошибка выхода:", await response.text());
      }
    } catch (error) {
      console.error("❌ Ошибка выхода:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : user ? (
        <div className="space-y-2">
          <p><strong>Логин:</strong> {user.login}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p className="text-red-500">Ошибка загрузки данных</p>
      )}

      <Button onClick={handleLogout}>Выйти</Button>
    </div>
  );
}
