// components/ProgressBar/Progressbar.tsx
"use client";
import React from "react";
import style from "./ProgressBar.module.css";

interface EvaluationBarProps {
  progress: number; // значение от 0 до 100
}

const EvaluationBar: React.FC<EvaluationBarProps> = ({ progress }) => {
  return (
    <div className={style.ProgressBar}>
      <div className={style.Slider} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default EvaluationBar;
