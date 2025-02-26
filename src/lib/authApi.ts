export type RegisterFormData = {
  login: string;
  email: string;
  password: string;
};

export type LoginFormData = {
  loginOrEmail: string;
  password: string;
};

export type UserData = {
  userLogin: string;
  userEmail: string;
};

// 🔹 Регистрация пользователя
export async function registerUser(data: RegisterFormData): Promise<{ success: boolean; message: string | null }> {
  try {
    if (!data.login || !data.email || !data.password) {
      throw new Error("❌ Логин, email и пароль обязательны");
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "❌ Ошибка регистрации");
    }

    return { success: true, message: null };
  } catch (error: any) {
    return { success: false, message: error.message ?? "❌ Ошибка регистрации" };
  }
}

// 🔹 Вход пользователя
export async function loginUser(data: LoginFormData): Promise<{ success: boolean; message: string | null }> {
  try {
    if (!data.loginOrEmail || !data.password) {
      throw new Error("❌ Логин/Email и пароль обязательны");
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "❌ Ошибка входа");
    }

    return { success: true, message: null };
  } catch (error: any) {
    return { success: false, message: error.message ?? "❌ Ошибка входа" };
  }
}

// 🔹 Получение данных пользователя (используется в чате и навигации)
export async function fetchUser(): Promise<{ userLogin: string; token: string } | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });

    console.log("📡 API /auth/me ответ:", res.status, await res.clone().json());

    if (!res.ok) throw new Error(`❌ Ошибка авторизации: ${res.status}`);

    const data = await res.json();
    if (!data.user || !data.user.userLogin) throw new Error("❌ API не вернул userLogin");
    if (!data.token) throw new Error("❌ Токен отсутствует в ответе API");

    console.log("✅ Пользователь загружен:", data.user.userLogin);
    return { userLogin: data.user.userLogin, token: data.token };
  } catch (error) {
    console.error("❌ Ошибка получения пользователя:", error);
    return null;
  }
}

// 🔹 Выход пользователя
export async function logoutUser(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    console.log("✅ Пользователь вышел");
  } catch (error) {
    console.error("❌ Ошибка выхода:", error);
  }
}
