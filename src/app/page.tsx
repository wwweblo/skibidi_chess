"use client";

import { useState } from "react";
import ChessBoardWpapper from "../components/ChessBoardWrapper/ChessBoardWrapper";
import Button from "@/components/Button/Button";
import Progressbar from "@/components/ProgressBar/Progressbar";

export default function Home() {

  return (
    <>
      <div className="m-10">
        <Button variant="agree">Подтвердить</Button>
        <Button variant="decline">Отмена</Button>
        <Button variant="info">Информация</Button>
        <Button variant="warning">Предупреждение</Button>
        <Button variant="neutral">Нейтральная</Button>
        <Button variant="default">Стандарт</Button>
      </div>

      <Progressbar/>
    </>
  );
}
