import React, { useEffect, useRef, useState, useMemo } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard, ChessboardDnDProvider } from "react-chessboard";
import style from './ChessBoardWrapper.module.css';
import Button from "../Button/Button";

interface ChessBoardWrapperProps {
  isFenVisible?: boolean;
  isTakebackAble?: boolean; // Новый параметр для отмены ходов
  size?: number;
  onFenChange?: (fen: string) => void;
}

const ChessBoardWrapper: React.FC<ChessBoardWrapperProps> = ({
  isFenVisible = false,
  isTakebackAble = false,
  size = 500,
  onFenChange
}) => {
  const game = useMemo(() => new Chess(), []);
  const [fenPosition, setFenPosition] = useState(game.fen());
  const [history, setHistory] = useState<Move[]>([]); // История ходов
  const [redoStack, setRedoStack] = useState<Move[]>([]); // Для повтора ходов
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");

  // Обработчик изменения FEN вручную
  const handleFenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fen = e.target.value;
    try {
      game.load(fen);
      setFenPosition(game.fen());
      onFenChange?.(game.fen());
      setHistory([]); // Сбрасываем историю при ручном вводе
      setRedoStack([]);
    } catch (error) {
      console.error("Некорректный FEN:", error);
    }
  };

  // Обработчик хода
  const handlePieceDrop = (sourceSquare: string, targetSquare: string, piece: string): boolean => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1]?.toLowerCase() ?? "q",
    });

    if (move) {
      setFenPosition(game.fen());
      setHistory([...history, move]); // Добавляем ход в историю
      setRedoStack([]); // Очищаем redo-стек при новом ходе
      onFenChange?.(game.fen());
      return true;
    }
    return false;
  };

  // Отмена хода (Undo)
  const handleUndo = () => {
    if (history.length > 0) {
      const lastMove = history[history.length - 1];
      game.undo();
      setFenPosition(game.fen());
      setHistory(history.slice(0, -1)); // Удаляем последний ход
      setRedoStack([lastMove, ...redoStack]); // Добавляем отменённый ход в redo-стек
      onFenChange?.(game.fen());
    }
  };

  // Повтор хода (Redo)
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextMove = redoStack[0];
      game.move(nextMove);
      setFenPosition(game.fen());
      setHistory([...history, nextMove]); // Добавляем ход обратно в историю
      setRedoStack(redoStack.slice(1)); // Удаляем из redo-стека
      onFenChange?.(game.fen());
    }
  };

  const handleRestart = () => {
    if (confirm("Restart the game?")) {
      game.reset(); // Reset the game state
      setFenPosition(game.fen()); // Update the FEN position
      setHistory([]); // Clear the move history
      setRedoStack([]); // Clear the redo stack
      onFenChange?.(game.fen()); // Notify any listeners of the FEN change
    }
  };
  

  // Копирование FEN
  const copyFenToClipboard = () => {
    navigator.clipboard.writeText(fenPosition)
      .then(() => {
        setCopyStatus("✔️");
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch(err => console.error("Ошибка при копировании FEN:", err));
  };

  return (
    <div className={style.wrapperContainer} style={{ width: size }}>

      <ChessboardDnDProvider>
        <Chessboard
          id="CustomChessboard"
          position={fenPosition}
          onPieceDrop={handlePieceDrop}
          boardWidth={size}
          boardOrientation={boardOrientation}
        />

        <div className="flex mt-5 gap-2">
          
          {isFenVisible && (
            <>
              <Button size='small' style='gray' onClick={copyFenToClipboard}>
                {copyStatus || "FEN"}
              </Button>
              <input
                ref={inputRef}
                value={fenPosition}
                onChange={handleFenInputChange}
                placeholder="Введите FEN"
                className={style.fenInputField}
                style={{ width: '100%' }}
              />
            </>
          )}
        </div>

        
        {isTakebackAble && (
          <div className="flex mt-2 gap-2">
            <Button size="small" style="gray" onClick={handleUndo} disabled={history.length === 0}>
              Undo ↩️
            </Button>
            <Button size="small" style="gray" onClick={handleRedo} disabled={redoStack.length === 0}>
              Redo ↪️
            </Button>
            
            <Button size="small" style="gray" onClick={handleRestart} disabled={history.length === 0}>
              Restart🗑️
            </Button>
          </div>
        )}

        <Button size="small" style="gray" onClick={() => {
          setBoardOrientation(boardOrientation === "white" ? "black" : "white")}}>
          Flip 🔄️
        </Button>
      </ChessboardDnDProvider>
    </div>
  );
};

export default ChessBoardWrapper;
