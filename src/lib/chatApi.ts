// lib/chatApi.ts
import axios from "axios";
import { Message } from "@/types/message";

const API_URL = "http://localhost:3001"; // Убедись, что API сервер работает

// ✅ Получение сообщений чата
export const fetchMessages = async (chatId: number): Promise<Message[]> => {
  try {
    const response = await axios.get(`${API_URL}/messages/${chatId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ Ошибка получения сообщений:", error);
    return [];
  }
};

// ✅ Отправка сообщения
export const sendMessage = async (text: string, chatId: number, userLogin: string): Promise<Message | null> => {
  try {
    const response = await axios.post(
      `${API_URL}/messages`,
      { text, chatId, userLogin }, // ✅ Теперь отправляем userLogin
      { 
        headers: { "Content-Type": "application/json" }, // ✅ Добавлен заголовок
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Ошибка отправки сообщения:", error);
    return null;
  }
};
