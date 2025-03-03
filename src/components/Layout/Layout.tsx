"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import NavMenuButton, { MenuItem } from "../NavMenuButton/NavMenuButton";
import Button from "../Button/Button";
import { Alert } from "../Alert/Alert";
import style from "./Layout.module.css";
import useGlobalSocketNotifications from "@/hooks/useGlobalSocketNotifications";

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

  // Глобальные уведомления через WebSocket
  useGlobalSocketNotifications();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          console.error(`❌ Ошибка авторизации: ${res.status} ${res.statusText}`);
          throw new Error("Не авторизован");
        }
        const data = await res.json();
        console.log("🔍 Ответ API /api/auth/me:", data);
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
    <main className={style.layoutContainer}>
      <Header>
        <div className={style.navBar}>
          <span className={style.logo} onClick={() => router.push('/')}>
            Chess.skibidi
          </span>
          <NavMenuButton label="Data" variant="neutral" items={data} />
          <NavMenuButton label="Play" variant="neutral" items={play} />
          <NavMenuButton label="Community" variant="neutral" items={community} />

          {isLoading ? (
            <Alert>⌛ Loading...</Alert>
          ) : userLogin ? (
            <Button
              variant="neutral"
              size="small"
              styles={`${style.userButton} justify-self-end`}
              onClick={() => router.push("/user/dashboard")}
            >
              🚹 {userLogin}
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
