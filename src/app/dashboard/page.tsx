"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/Button/Button";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ login: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Не авторизован");
        return res.json();
      })
      .then((data) => setUser({ login: data.userLogin, email: data.userEmail }))
      .catch(() => router.push("/user/login"));
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (response.ok) {
        router.push("/user/login");
      } else {
        console.error("Ошибка выхода:", await response.text());
      }
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

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

      <Button onClick={handleLogout} style="red">Выйти</Button>
    </div>
  );
}
