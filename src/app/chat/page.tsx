"use client";

import React, { useEffect, useState } from "react";
import Chat from "@/components/Chat/Chat";

const ChatPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="loading">⏳ Загрузка...</div>; // Фикс SSR-проблем
  }

  return <Chat chatId={1} />;
};

export default ChatPage;
