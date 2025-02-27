"use client";

import Button from "@/components/Button/Button";
import Progressbar from "@/components/ProgressBar/Progressbar";
import Card from "@/components/Card/Card";

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

      <Card
        header='How to move'
        description="you'll learn game basics"
        path='/database/learn'/>
    </>
  );
}
