"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard, ChessboardDnDProvider } from "react-chessboard";
import style from "./ChessBoardWrapper.module.css";
import Button from "../Button/Button";
import Engine from "@/utils/stockfishEngine";

interface ChessBoardWrapperProps {
  isFenVisible?: boolean;
  isTakebackAble?: boolean;
  stockfishDepth?: number;
  size?: number;
  onFenChange?: (fen: string) => void;
}

const ChessBoardWrapper: React.FC<ChessBoardWrapperProps> = ({
  isFenVisible = false,
  isTakebackAble = false,
  stockfishDepth,
  size = 500,
  onFenChange
}) => {
  const game = useMemo(() => new Chess(), []);
  const [fenPosition, setFenPosition] = useState(game.fen());
  const [history, setHistory] = useState<Move[]>([]);
  const [redoStack, setRedoStack] = useState<Move[]>([]);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");
  const [engine] = useState(() => (stockfishDepth ? new Engine() : null));

  useEffect(() => {
    if (!engine) return;

    const handleMessage = ({ bestMove }: { bestMove?: string }) => {
      if (bestMove) {
        game.move(bestMove);
        updateBoardState();
      }
    };

    engine.onMessage(handleMessage);
    return () => engine.terminate();
  }, [engine]);

  const updateBoardState = () => {
    setFenPosition(game.fen());
    setHistory(game.history({ verbose: true }) as Move[]);
    setRedoStack([]);
    onFenChange?.(game.fen());
  };

  const handleFenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fen = e.target.value;
    try {
      game.load(fen);
      updateBoardState();
    } catch (error) {
      console.error("Некорректный FEN:", error);
    }
  };

  const handlePieceDrop = (sourceSquare: string, targetSquare: string, piece: string): boolean => {
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });

    if (move) {
      updateBoardState();
      if (stockfishDepth) engine?.evaluatePosition(game.fen(), stockfishDepth);
      return true;
    }
    return false;
  };

  const handleUndo = () => {
    if (history.length > 0) {
      game.undo();
      updateBoardState();
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      game.move(redoStack[0]);
      setRedoStack(redoStack.slice(1));
      updateBoardState();
    }
  };

  const handleRestart = () => {
    if (confirm("Вы уверены, что хотите перезапустить игру?")) {
      game.reset();
      updateBoardState();
    }
  };

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

        <div className={style.controls}>
          {isFenVisible && (
            <div className={style.fenContainer}>
              <Button size="small" variant="info" onClick={copyFenToClipboard}>
                {copyStatus || "📋 FEN"}
              </Button>
              <input
                ref={inputRef}
                value={fenPosition}
                onChange={handleFenInputChange}
                placeholder="Введите FEN"
                className={style.fenInputField}
              />
            </div>
          )}

          {isTakebackAble && (
            <div className={style.actions}>
              <Button size="small" variant="neutral" onClick={handleUndo} disabled={history.length === 0}>
                ↩️ Отменить
              </Button>
              <Button size="small" variant="neutral" onClick={handleRedo} disabled={redoStack.length === 0}>
                ↪️ Вернуть
              </Button>
              <Button size="small" variant="decline" onClick={handleRestart} disabled={history.length === 0}>
                🗑️ Перезапустить
              </Button>
            </div>
          )}

          <Button size="small" variant="neutral" onClick={() => setBoardOrientation(boardOrientation === "white" ? "black" : "white")}>
            🔄 Перевернуть доску
          </Button>
        </div>
      </ChessboardDnDProvider>
    </div>
  );
};

export default ChessBoardWrapper;
