"use client";

import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import NavMenuButton, { MenuItem } from "../NavMenuButton/NavMenuButton";
import Button from "../Button/Button";
import { useRouter } from "next/navigation";

// 🛠 Функция для получения куки по имени
const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};

interface LayoutProps {
  children?: React.ReactNode;
}

const data: MenuItem[] = [
  { label: "Main Page", link: "http://localhost:3000/", description: "home sweet home" },
  { label: "Openings", link: "http://localhost:3000/database", description: "update your knowledge" },
];

const play: MenuItem[] = [
  { label: "...with bot", link: "http://localhost:3000/play/bot", description: "test yourself" }
];

const community: MenuItem[] = [
  { label: "Chat", link: "http://localhost:3000/chat", description: "find some new friends" }
];

const guestMenu: MenuItem[] = [
  { label: "Login", link: "http://localhost:3000/user/login", description: "Enter your account" },
  { label: "Register", link: "http://localhost:3000/user/register", description: "Create an account" }
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token"); // 🍪 Теперь токен берём из cookie
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Раскодируем payload
        setUserLogin(decodedToken.userLogin);
      } catch (error) {
        console.error("❌ Ошибка декодирования токена:", error);
      }
    }
  }, []);

  return (
    <main>
      <Header>
        <div className="flex gap-4 items-center">
          <span className="font-bold text-lg">Chess.skibidi</span>
          <NavMenuButton label="Data" style="p-5" items={data} />
          <NavMenuButton label="Play" style="p-5" items={play} />
          <NavMenuButton label="Community" style="p-5" items={community} />

          {/* Кнопка для входа пользователя */}
          {userLogin ? (
              <Button
                style="green"
                size="small"
                onClick={() => router.push("/dashboard")}
              >
                {userLogin}
              </Button>
            ) : (
              <NavMenuButton label="Sign In" style="p-5" items={guestMenu} />
            )}
        </div>
      </Header>
      {children}
      <Footer />
    </main>
  );
};

export default Layout;
