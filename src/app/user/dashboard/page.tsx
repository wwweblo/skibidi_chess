"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import { Alert } from "@/components/Alert/Alert";
import style from "./dashboard.module.css"

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
    <div className={`max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg ${style.Container}`}>
      <h2 className={style.Header}>Личный кабинет</h2>

      {loading ? (
        <Alert>🛜 Загрузка...</Alert>
      ) : user ? (
        <table>
          <tbody>
            <tr>
              <th className={style.TableHeader}>Логин:</th>
              <td className={style.TableData}>{user.login}</td>
            </tr>
            <tr>
              <th className={style.TableHeader}>Email:</th>
              <td className={style.TableData}>{user.email}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <Alert>🥵 Ошибка загрузки данных</Alert>
      )}

      <Button variant="decline" onClick={handleLogout}>Выйти</Button>
    </div>
  );
}
