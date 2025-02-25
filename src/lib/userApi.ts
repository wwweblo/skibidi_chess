export async function fetchUserProfile(login: string) {
    try {
      const res = await fetch(`/api/user/${login}`);
      if (!res.ok) throw new Error("Пользователь не найден");
  
      return res.json();
    } catch (error) {
      console.error("❌ Ошибка загрузки профиля:", error);
      return null;
    }
  }
  