"use client";
import React, { ReactNode } from "react";
import styles from "./Button.module.css";
import classNames from "classnames";

interface ButtonProps {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: "green" | "red" | "gray";
  size?: "small" | "middle" | "big";
  disabled?: boolean; // ✅ Добавлена поддержка `disabled`
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  style = "gray",
  size = "middle",
  disabled = false
}) => {
  // Стили кнопки
  const buttonStyle = classNames({
    [styles.green]: style === "green",
    [styles.red]: style === "red",
    [styles.gray]: style === "gray",
    [styles.defaultStyle]: !["green", "red", "gray"].includes(style)
  });

  // Размер кнопки
  const buttonSize = classNames({
    [styles.small]: size === "small",
    [styles.middle]: size === "middle",
    [styles.big]: size === "big"
  });

  return (
    <button
      className={`${buttonStyle} ${buttonSize} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled} // ✅ Теперь можно передавать `disabled`
    >
      {children}
    </button>
  );
};

export default Button;
