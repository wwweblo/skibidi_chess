import { Message } from "@/types/message";

export async function fetchMessages(): Promise<Message[]> {
  try {
    const res = await fetch("/api/chat/messages");

    if (!res.ok) {
      console.error(`❌ Ошибка загрузки: ${res.status} ${res.statusText}`);
      throw new Error("Ошибка загрузки сообщений");
    }

    const data = await res.json().catch(() => null);
    if (!data) throw new Error("Неверный формат ответа");

    return data;
  } catch (error) {
    console.error("❌ Ошибка API:", error);
    return [];
  }
}

export async function sendMessage(text: string): Promise<Message | null> {
  try {
    const res = await fetch("/api/chat/send", {
      method: "POST",
      credentials: "include", // ✅ Передаем куки
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      console.error(`❌ Ошибка отправки: ${res.status} ${res.statusText}`);
      throw new Error("Ошибка отправки сообщения");
    }

    return res.json();
  } catch (error) {
    console.error("❌ Ошибка отправки сообщения:", error);
    return null;
  }
}
