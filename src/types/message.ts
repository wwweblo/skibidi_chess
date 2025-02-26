export interface Message {
  id: number;
  text: string;
  userLogin: string;
  createdAt: string;
  chatId: number; // ✅ Добавляем chatId
}
