"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type LoginFormData = {
  loginOrEmail: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // ✅ Теперь браузер отправит cookie с JWT
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      router.push("/dashboard"); // ✅ Теперь куки будут использоваться автоматически
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Вход</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <input {...register("loginOrEmail")} placeholder="Логин или Email" className="p-2 border rounded" required />
        <input {...register("password")} type="password" placeholder="Пароль" className="p-2 border rounded" required />
        <button type="submit" className="p-2 bg-green-500 text-white rounded">Войти</button>
      </form>
    </div>
  );
}
