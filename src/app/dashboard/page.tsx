"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button/Button";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ login: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/user/login"); // Перенаправление на страницу логина, если нет токена
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Декодируем payload
      setUser({ login: decodedToken.userLogin, email: decodedToken.userEmail });
    } catch (error) {
      console.error("Ошибка декодирования токена", error);
      localStorage.removeItem("token");
      router.push("/user/login"); // Перенаправление, если токен поврежден
    }
  }, [router]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет</h2>

      {user ? (
        <div className="space-y-2">
          <p><strong>Логин:</strong> {user.login}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Загрузка...</p>
      )}

      <Button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        style="red"
      >
        Выйти
      </Button>
    </div>
  );
}
