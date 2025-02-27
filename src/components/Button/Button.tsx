"use client";
import React, { ReactNode } from "react";
import style from "./Button.module.css";
import classNames from "classnames";

interface ButtonProps {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "agree" | "decline" | "info" | "warning" | "neutral" | "default";
  size?: "small" | "middle" | "big";
  disabled?: boolean;
  styles?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "default",
  size = "middle",
  disabled = false,
  styles
}) => {
  const buttonClass = classNames(style.button, style[variant], style[size], {
    [style.disabled]: disabled
  });

  return (
    <button
      className={`${buttonClass} ${styles}`}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
