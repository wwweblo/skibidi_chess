"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RegisterFormData, registerUser } from "@/lib/authApi";
import style from "@/app/user/user.module.css";
import Button from "@/components/Button/Button";
import TextBox from "@/components/TextBox/TextBox";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<RegisterFormData>();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    const result = await registerUser(data);
    if (!result.success) {
      setError(result.message ?? '🥵 Ошибочка вышла');
      return;
    }

    router.push("/user/dashboard");
  };

  return (
    <div className={style.formContainer}>
      <div className={style.Container}>
        <h2 className={style.Header}>Регистрация</h2>
        {error && <p className={style.error}>{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
          <TextBox {...register("login")} name="login" placeholder="Логин" required />
          <TextBox {...register("email")} name="email" type="email" placeholder="Email" required />
          <TextBox {...register("password")} name="password" type="password" placeholder="Пароль" required />
          <Button variant="agree" size="big">Зарегистрироваться</Button>
        </form>
      </div>

      <div className={style.registerContainer}>
        <Link href="/user/login">
          Уже есть аккаунт? <b className={style.link}>Войти</b>
        </Link>
      </div>
    </div>
  );
}
