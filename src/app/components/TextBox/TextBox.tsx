import React, { ReactNode } from "react";
import style from "./TextBox.module.css";

interface TextBoxProps {
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextBox: React.FC<TextBoxProps> = ({ placeholder = "text...", value, onChange }) => {
    return (
        <input
            className={style.textBox}
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={onChange}
        />
    );
};

export default TextBox;
