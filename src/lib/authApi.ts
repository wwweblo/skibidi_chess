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

// 🔹 Функция регистрации пользователя
export async function registerUser(data: RegisterFormData): Promise<{ success: boolean; message: string | null }> {
  try {
    if (!data.login || !data.email || !data.password) {
      throw new Error("Логин, email и пароль обязательны");
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Ошибка регистрации");
    }

    return { success: true, message: null };
  } catch (error: any) {
    return { success: false, message: error.message ?? "Ошибка регистрации" };
  }
}

// 🔹 Функция входа пользователя
export async function loginUser(data: LoginFormData): Promise<{ success: boolean; message: string | null }> {
  try {
    if (!data.loginOrEmail || !data.password) {
      throw new Error("Логин/Email и пароль обязательны");
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Ошибка входа");
    }

    return { success: true, message: null };
  } catch (error: any) {
    return { success: false, message: error.message ?? "Ошибка входа" };
  }
}

// 🔹 Функция получения данных пользователя (используется в чате и навигации)
export async function fetchUser() {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });

    if (!res.ok) throw new Error(`❌ Ошибка авторизации: ${res.status} ${res.statusText}`);

    const data = await res.json();
    console.log("✅ Пользователь получен:", data);

    if (!data?.user?.userLogin) throw new Error("❌ API не вернул userLogin");

    return {
      userLogin: data.user.userLogin,
      token: data.token || data.user.token, // ✅ Поддержка разных форматов ответа
    };
  } catch (error) {
    console.error("❌ Ошибка получения пользователя:", error);
    return null;
  }
}




// 🔹 Функция выхода пользователя
export async function logoutUser(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch (error) {
    console.error("❌ Ошибка выхода:", error);
  }
}
