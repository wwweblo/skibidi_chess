"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RegisterFormData } from "@/types/RegisterFormData";

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<RegisterFormData>();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // ✅ Добавлено: теперь куки с токеном сохранятся
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      router.push("/dashboard"); // ✅ Теперь сразу перенаправляет в личный кабинет
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <input {...register("login")} placeholder="Логин" className="p-2 border rounded" required />
        <input {...register("email")} type="email" placeholder="Email" className="p-2 border rounded" required />
        <input {...register("password")} type="password" placeholder="Пароль" className="p-2 border rounded" required />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Зарегистрироваться</button>
      </form>
    </div>
  );
}
