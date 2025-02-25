"use client";

import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import NavMenuButton, { MenuItem } from "../NavMenuButton/NavMenuButton";
import Button from "../Button/Button";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children?: React.ReactNode;
}

const data: MenuItem[] = [
  { label: "Main Page", link: "/", description: "Home sweet home" },
  { label: "Openings", link: "/database", description: "Update your knowledge" },
];

const play: MenuItem[] = [
  { label: "...with bot", link: "/play/bot", description: "Test yourself" }
];

const community: MenuItem[] = [
  { label: "Chat", link: "/chat", description: "Find some new friends" }
];

const guestMenu: MenuItem[] = [
  { label: "Login", link: "/user/login", description: "Enter your account" },
  { label: "Register", link: "/user/register", description: "Create an account" }
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });

        if (!res.ok) {
          console.error(`❌ Ошибка авторизации: ${res.status} ${res.statusText}`);
          throw new Error("Не авторизован");
        }

        const data = await res.json();
        console.log("🔍 Ответ API /api/auth/me:", data); // Логируем, что пришло от сервера

        if (data?.user?.userLogin) {
          setUserLogin(data.user.userLogin);
        } else {
          console.warn("⚠️ API не вернул userLogin. Полученные данные:", data);
        }
      } catch (error) {
        console.error("❌ Ошибка получения пользователя:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <main className="layoutContainer">
      <Header>
        <div className="navBar">
          <span className="logo">Chess.skibidi</span>
          <NavMenuButton label="Data" variant="neutral" items={data} />
          <NavMenuButton label="Play" variant="neutral" items={play} />
          <NavMenuButton label="Community" variant="neutral" items={community} />

          {/* 🔥 Фикс Hydration: показываем заглушку перед рендерингом */}
          {isLoading ? (
            <span className="loading-placeholder">Loading...</span>
          ) : userLogin ? (
            <Button
              variant="agree"
              size="small"
              onClick={() => router.push("/user/dashboard")}
            >
              {userLogin}
            </Button>
          ) : (
            <NavMenuButton label="Sign In" variant="info" items={guestMenu} />
          )}
        </div>
      </Header>
      <div className="contentContainer">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
