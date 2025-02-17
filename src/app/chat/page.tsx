"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

type Message = {
  id: number;
  text: string;
  userLogin: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userLogin, setUserLogin] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/chat/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));

    socket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    setUserLogin(decodedToken.userLogin);

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const token = localStorage.getItem("token");
    const response = await fetch("/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newMessage }),
    });

    if (response.ok) {
      const message = await response.json();
      socket.emit("message", message);
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Чат</h2>

      <div className="h-64 overflow-y-auto border p-2 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-bold">{msg.userLogin}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-1 p-2 border rounded"
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded">
          Отправить
        </button>
      </div>
    </div>
  );
}
