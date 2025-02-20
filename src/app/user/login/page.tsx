"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginFormData, loginUser } from "@/lib/authApi";
import Button from "@/components/Button/Button";
import Link from "next/link";
import TextBox from "@/components/TextBox/TextBox";
import style from "@/app/user/user.module.css";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    const result = await loginUser(data);
    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className={style.formContainer}>
      <div className={style.container}>
        <h2 className={style.formHeader}>Вход</h2>
        {error && <p className={style.error}>{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
          <TextBox
            {...register("loginOrEmail", { required: "Введите логин или email" })}
            label="Логин или Email"
            error={errors.loginOrEmail?.message}
            placeholder="Введите логин или email"
          />
          <TextBox
            {...register("password", { required: "Введите пароль" })}
            label="Пароль"
            type="password"
            error={errors.password?.message}
            placeholder="Введите пароль"
          />
          <Button size="big" style="green">Войти</Button>
        </form>
      </div>

      <div className={style.registerContainer}>
        <Link href="/user/register">
          Нет аккаунта? <b className={style.link}>Зарегистрироваться</b>
        </Link>
      </div>
    </div>
  );
}
