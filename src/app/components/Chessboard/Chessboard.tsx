import React, { useEffect, useRef, useState, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard, ChessboardDnDProvider } from "react-chessboard";
import style from './ChessBoardWrapper.module.css';
import Button from "../Button/Button";

interface ChessBoardWrapperProps {
  isFenVisible?: boolean;
  size?: number;
}

const ChessBoardWrapper: React.FC<ChessBoardWrapperProps> = ({
  isFenVisible = false,
  size = 500
}) => {
  const game = useMemo(() => new Chess(), []);
  const [fenPosition, setFenPosition] = useState(game.fen());
  const [copyStatus, setCopyStatus] = useState<string | null>(null); // Состояние для отслеживания статуса копирования
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fen = e.target.value;

    try {
      game.load(fen); // Если FEN некорректен, будет выброшена ошибка
      setFenPosition(game.fen());
    } catch (error) {
      console.error("Некорректный FEN:", error);
    }
  };

  const handlePieceDrop = (sourceSquare: string, targetSquare: string, piece: string): boolean => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });

    if (move) {
      setFenPosition(game.fen());
      return true; // Успешное перемещение
    }

    return false; // Не удалось переместить
  };

  const copyFenToClipboard = () => {
    navigator.clipboard.writeText(fenPosition)
      .then(() => {
        setCopyStatus("✔️"); // Устанавливаем статус копирования на галочку
        setTimeout(() => {
          setCopyStatus(null); // Сбрасываем статус через 2 секунды
        }, 2000);
      })
      .catch(err => {
        console.error("Ошибка при копировании FEN:", err);
      });
  };

  return (
    <div 
      className={style.wrapperContainer}
      style={{ width: size }}>
      <ChessboardDnDProvider>
        <Chessboard
          id="CustomChessboard"
          position={fenPosition}
          onPieceDrop={handlePieceDrop}
          boardWidth={size}
        />
        <div className="flex mt-5">
          <Button size='small' style='gray' onClick={copyFenToClipboard}>
            {copyStatus || "FEN"} {/* Отображаем статус копирования или текст кнопки */}
          </Button>
          {isFenVisible && (
            <input
              ref={inputRef}
              value={fenPosition}
              onChange={handleFenInputChange}
              placeholder="Введите FEN для изменения позиции"
              className={style.fenInputField}
              style={{ width: '100%' }} // Устанавливаем ширину в 100%
            />
          )}
        </div>
      </ChessboardDnDProvider>
    </div>
  );
};

export default ChessBoardWrapper;