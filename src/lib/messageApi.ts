import { Message } from "@/types/message";

export async function fetchMessages(chatId?: number): Promise<Message[]> {
  try {
    const url = chatId ? `/api/chat/messages?chatId=${chatId}` : "/api/chat/messages";
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`❌ Ошибка загрузки: ${res.status} ${res.statusText}`);
      throw new Error("Ошибка загрузки сообщений");
    }

    const data: Message[] = await res.json(); // ✅ Теперь `chatId` есть в `Message`
    return data;
  } catch (error) {
    console.error("❌ Ошибка API:", error);
    return [];
  }
}


export async function sendMessage(text: string, chatId: number): Promise<Message | null> {
  try {
    if (!chatId) {
      console.error("❌ Ошибка: chatId отсутствует перед отправкой сообщения!");
      throw new Error("chatId обязателен");
    }

    console.log("📡 Отправка сообщения:", { text, chatId });

    const res = await fetch("/api/chat/send", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, chatId }), // ✅ Убедись, что chatId передается!
    });

    console.log("📡 Статус ответа сервера:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Ошибка API /chat/send:", errorText);
      throw new Error(`Ошибка ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log("✅ API /chat/send: Сообщение отправлено", data);
    return data;
  } catch (error) {
    console.error("❌ Ошибка отправки сообщения:", error);
    return null;
  }
}
