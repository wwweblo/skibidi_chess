"use client";
import { useState, useEffect } from "react";
import ChessBoardWrapper from "@/components/ChessBoardWrapper/ChessBoardWrapper";
import Button from "@/components/Button/Button";
import TextBox from "@/components/TextBox/TextBox";

const start_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // Начальная позиция

const ChessPage = () => {
  const [fen, setFen] = useState<string>(start_fen);
  const [positionNameEn, setPositionNameEn] = useState<string>("");
  const [positionNameRu, setPositionNameRu] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonStyle, setButtonStyle] = useState<"gray" | "red" | "green">("gray");
  const [buttonText, setButtonText] = useState<string>("Сохранить позицию");

  // Функция для загрузки позиции по FEN
  const fetchPosition = async (fen: string) => {
    setLoading(true);
    try {
      console.log("Запрашиваем FEN:", fen);
      const response = await fetch(`/api/openings?fen=${encodeURIComponent(fen)}`);
      const data = await response.json();
      
      console.log("Полученные данные:", data);
  
      if (data.error) {
        setButtonStyle("red");
        setButtonText("Сохранить позицию");
      } else {
        setPositionNameEn(data.name_en || "");
        setPositionNameRu(data.name_ru || "");
        setButtonStyle("gray");
        setButtonText("Сохранить позицию");
      }
    } catch (error) {
      console.error("Ошибка загрузки позиции:", error);
    }
    setLoading(false);
  };
  
  // Загружаем стартовую позицию при первой загрузке
  useEffect(() => {
    fetchPosition(start_fen);
  }, []);

  // Функция сохранения или обновления позиции
  const savePosition = async () => {
    if (!fen || (!positionNameEn && !positionNameRu)) return;

    try {
      const responseCheck = await fetch(`/api/openings?fen=${encodeURIComponent(fen)}`);
      const dataCheck = await responseCheck.json();

      if (dataCheck.error) {
        // Если записи нет, создаем новую
        const responseCreate = await fetch("/api/openings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name_en: positionNameEn,
            name_ru: positionNameRu,
            fen,
          }),
        });

        await responseCreate.json();
        setButtonStyle("green");
        setButtonText("Сохранено");
      } else {
        // Если запись найдена, обновляем её
        const existingId = dataCheck.id;
        const responseUpdate = await fetch("/api/openings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: existingId,
            name_en: positionNameEn,
            name_ru: positionNameRu,
            fen,
          }),
        });

        await responseUpdate.json();
        setButtonStyle("green");
        setButtonText("Обновлено");
      }
    } catch (error) {
      console.error("Ошибка сохранения позиции:", error);
    }
  };

  return (
    <div className="m-10 flex gap-4">
      {/* Шахматная доска */}
      <ChessBoardWrapper
        isFenVisible={true}
        isTakebackAble={true}
        size={500}
        onFenChange={(newFen) => {
          setFen(newFen);
          fetchPosition(newFen); // Загружаем название при изменении позиции
        }}
      />

      {/* Поля ввода названий */}
      <div className="flex flex-col w-[450px] gap-4">
        <TextBox
          value={positionNameEn}
          onChange={(e) => setPositionNameEn(e.target.value)}
          placeholder="Название позиции (English)"
        />
        <TextBox
          value={positionNameRu}
          onChange={(e) => setPositionNameRu(e.target.value)}
          placeholder="Название позиции (Русский)"
        />
        <Button size="middle" style={buttonStyle} onClick={savePosition}>
          {buttonText}
        </Button>
        {loading && <p>Загрузка...</p>}
      </div>
    </div>
  );
};

export default ChessPage;
