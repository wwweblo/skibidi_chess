"use client";
import React, { ReactNode } from "react";
import styles from "./Button.module.css";
import classNames from "classnames";

interface ButtonProps {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "agree" | "decline" | "info" | "warning" | "neutral" | "default";
  size?: "small" | "middle" | "big";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "default",
  size = "middle",
  disabled = false
}) => {
  const buttonClass = classNames(styles.button, styles[variant], styles[size], {
    [styles.disabled]: disabled
  });

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
