import { Message } from "@/types/message";

export async function fetchMessages(): Promise<Message[]> {
  try {
    const res = await fetch("/api/chat/messages");
    if (!res.ok) throw new Error("❌ Ошибка загрузки сообщений");
    return await res.json();
  } catch (error) {
    console.error("❌ Ошибка API сообщений:", error);
    return [];
  }
}

export async function sendMessage(text: string): Promise<Message | null> {
  try {
    const res = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("❌ Ошибка отправки сообщения");

    return await res.json();
  } catch (error) {
    console.error("❌ Ошибка отправки сообщения:", error);
    return null;
  }
}
