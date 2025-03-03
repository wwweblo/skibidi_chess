import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log("🔥 Очистка базы данных...");

    // Удаляем данные в правильном порядке (чтобы не нарушить связи)
    await prisma.message.deleteMany({});
    await prisma.chatParticipant.deleteMany({});
    await prisma.chat.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("✅ Все данные удалены.");
  } catch (error) {
    console.error("❌ Ошибка при очистке базы данных:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
clearDatabase();
