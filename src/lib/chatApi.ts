// lib/chatApi.ts
import axios from "axios";
import { Message } from "@/types/message";

const API_URL = "http://localhost:3001";

// ✅ Получение сообщений чата
export const fetchMessages = async (chatId: number): Promise<Message[]> => {
  try {
    const response = await axios.get(`${API_URL}/messages/${chatId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Ошибка получения сообщений:", error);
    return [];
  }
};

// ✅ Отправка сообщения
export const sendMessage = async (
  text: string,
  chatId: number,
  userLogin: string
): Promise<Message | null> => {
  try {
    const response = await axios.post(
      `${API_URL}/messages`,
      { text, chatId, userLogin },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Ошибка отправки сообщения:", error);
    return null;
  }
};

// ✅ Проверка доступа к чату
export async function checkChatAccess(
  chatId: number,
  userLogin: string
): Promise<boolean> {
  try {
    const response = await axios.get(`${API_URL}/chat/access`, {
      params: { chatId, userLogin },
      withCredentials: true,
    });
    console.log("✅ Результат проверки доступа:", response.data);
    return response.data.hasAccess;
  } catch (error) {
    console.error("❌ Ошибка проверки доступа:", error);
    return false;
  }
}
