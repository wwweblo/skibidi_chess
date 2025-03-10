export async function fetchUserProfile(login: string) {
  try {
    const res = await fetch(`/api/user/${login}`);
    if (!res.ok) throw new Error("❌ Пользователь не найден");
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Ошибка загрузки профиля пользователя:", error);
    return null;
  }
}

export async function getOrCreateChat(userLogin: string, targetLogin: string) {
  try {
    console.log(`📡 Отправляем запрос на создание чата между: ${userLogin} ↔ ${targetLogin}`);
    
    const res = await fetch("/api/chat/getOrCreateChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userLogin, targetLogin }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ Ошибка сервера при создании чата:", errorData);
      throw new Error(errorData.error || "Ошибка создания чата");
    }
    
    const data = await res.json();
    console.log(`✅ Чат создан/найден с id: ${data.chatId}`);
    return data.chatId;
  } catch (error) {
    console.error("❌ Ошибка запроса чата:", error);
    return null;
  }
}

export async function fetchUser() {
  try {
    const res = await fetch("/api/auth/user", { credentials: "include" });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Ошибка получения пользователя: ${res.status} ${res.statusText}`, errorText);
      return null;
    }
    
    const data = await res.json();
    console.log("✅ Авторизованный пользователь:", data);
    return data;
  } catch (error) {
    console.error("❌ Ошибка запроса пользователя:", error);
    return null;
  }
}

export async function fetchSortedUsers(userLogin: string) {
  try {
    const res = await fetch(`/api/user?userLogin=${userLogin}`);
    if (!res.ok) throw new Error("Ошибка загрузки пользователей");

    return await res.json();
  } catch (error) {
    console.error("❌ Ошибка запроса пользователей:", error);
    return [];
  }
}
