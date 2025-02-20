import React, { forwardRef } from "react";
import style from "./TextBox.module.css";

interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// ✅ Используем `forwardRef` для корректной работы с `react-hook-form`
const TextBox = forwardRef<HTMLInputElement, TextBoxProps>(function TextBox(
  { label, error, className, ...props },
  ref
) {
  return (
    <div className={`${style.textBoxContainer} ${className || ""}`}>
      {label && <label htmlFor={props.name} className={style.label}>{label}</label>}
      <input
        ref={ref}
        id={props.name}
        className={`${style.textBox} ${error ? style.errorInput : ""}`}
        {...props}
      />
      {error && <span className={style.errorText}>{error}</span>}
    </div>
  );
});

export default TextBox;
