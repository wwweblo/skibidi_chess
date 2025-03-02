// components/ChessBoardWrapper/ChessBoardWrapper.tsx
"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Chess, Move } from "chess.js";
import ChessboardDisplay from "./ChessboardDisplay";
import BoardControls from "./BoardControls";
import style from "./ChessBoardWrapper.module.css";
import Engine from "@/utils/Engine";
import { mapEvaluationToPercentage } from "@/utils/chessUtils";

interface ChessBoardWrapperProps {
  isFenVisible?: boolean;
  isTakebackAble?: boolean;
  stockfishDepth?: number;
  size?: number;
  onFenChange?: (fen: string) => void;
  userColor?: "white" | "black"; // Пользователь играет за указанную сторону
}

const ChessBoardWrapper: React.FC<ChessBoardWrapperProps> = ({
  isFenVisible = false,
  isTakebackAble = false,
  stockfishDepth,
  size = 500,
  onFenChange,
  userColor = "white"
}) => {
  const game = useMemo(() => new Chess(), []);
  const [fenPosition, setFenPosition] = useState(game.fen());
  const [history, setHistory] = useState<Move[]>([]);
  const [redoStack, setRedoStack] = useState<Move[]>([]);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [numericEval, setNumericEval] = useState<number>(0);
  const [evaluation, setEvaluation] = useState<number>(50);
  const inputRef = useRef<HTMLInputElement>(null);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(userColor);
  const [engine] = useState(() => (stockfishDepth ? new Engine() : null));

  // Обработка сообщений от движка
  useEffect(() => {
    if (!engine) return;

    const handleMessage = ({
      bestMove,
      evaluation: engineEval,
    }: {
      bestMove?: string;
      evaluation?: number;
    }) => {

      if (typeof engineEval !== "undefined") {
        setNumericEval(engineEval);
        setEvaluation(mapEvaluationToPercentage(engineEval));
        // console.log(`Evaluation: ${(engineEval / 100).toFixed(2)}`); // Логирование оценки в консоль
      }
      // Бот играет за сторону, противоположную пользователю
      const engineTurn = userColor === "white" ? "b" : "w";
      if (bestMove && game.turn() === engineTurn) {
        game.move(bestMove);
        updateBoardState();
      }
    };

    engine.onMessage(handleMessage);
    return () => engine.terminate();
  }, [engine, userColor, game]);

  const updateBoardState = () => {
    const newFen = game.fen();
    setFenPosition(newFen);
    setHistory(game.history({ verbose: true }) as Move[]);
    setRedoStack([]);
    onFenChange?.(newFen);
    if (stockfishDepth && engine) {
      engine.evaluatePosition(newFen, stockfishDepth);
    }
  };

  useEffect(() => {
    if (stockfishDepth && engine) {
      engine.evaluatePosition(game.fen(), stockfishDepth);
    }
  }, [fenPosition, engine, stockfishDepth, game]);

  const handleFenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fen = e.target.value;
    try {
      game.load(fen);
      updateBoardState();
    } catch (error) {
      console.error("Некорректный FEN:", error);
    }
  };

  const handlePieceDrop = (
    sourceSquare: string,
    targetSquare: string,
    piece: string
  ): boolean => {
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (move) {
      updateBoardState();
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
    navigator.clipboard
      .writeText(fenPosition)
      .then(() => {
        setCopyStatus("✔️");
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch((err) => console.error("Ошибка при копировании FEN:", err));
  };

  const flipBoard = () => {
    setBoardOrientation(boardOrientation === "white" ? "black" : "white");
  };

  return (
    <div className={style.wrapperContainer} style={{ width: size }}>
      <ChessboardDisplay
        fenPosition={fenPosition}
        size={size}
        boardOrientation={boardOrientation}
        onPieceDrop={handlePieceDrop}
      />
      <BoardControls
        isFenVisible={isFenVisible}
        isTakebackAble={isTakebackAble}
        fenPosition={fenPosition}
        copyStatus={copyStatus}
        inputRef={inputRef}
        onFenInputChange={handleFenInputChange}
        onCopyFen={copyFenToClipboard}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRestart={handleRestart}
        boardOrientation={boardOrientation}
        onFlipBoard={flipBoard}
        evaluation={evaluation}
        numericEval={numericEval}
      />
    </div>
  );
};

export default ChessBoardWrapper;
