"use client";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Chess, Move, Square } from "chess.js";
import { Chessboard, ChessboardDnDProvider } from "react-chessboard";
import style from "./ChessBoardWrapper.module.css";
import Button from "../Button/Button";
import Modal from "../Modal/Modal"; 
import Engine from "@/utils/stockfishEngine"; 

interface ChessBoardWrapperProps {
  isFenVisible?: boolean;
  isTakebackAble?: boolean;
  size?: number;
  onFenChange?: (fen: string) => void;
  stockfishDepth?: number;
}

const ChessBoardWrapper: React.FC<ChessBoardWrapperProps> = ({
  isFenVisible = false,
  isTakebackAble = false,
  size = 500,
  onFenChange,
  stockfishDepth,
}) => {
  const engine = useMemo(() => (stockfishDepth ? new Engine() : null), [stockfishDepth]);
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (game.turn() === "b" && stockfishDepth && !game.isGameOver()) {
      setTimeout(makeStockfishMove, 500);
    }
  }, [game, stockfishDepth]);

  useEffect(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setModalContent(game.turn() === "w" ? "Stockfish выиграл!" : "Ты выиграл!");
      } else if (game.isDraw()) {
        setModalContent("Ничья!");
      }
      setIsModalOpen(true);
    }
  }, [game]);

  const makeStockfishMove = useCallback(() => {
    engine?.evaluatePosition(game.fen(), stockfishDepth || 10);
    engine?.onMessage(({ bestMove }) => {
      if (!bestMove) return;

      const validMoves = game.moves({ verbose: true }) as { from: Square; to: Square; promotion?: string }[];
      const isValid = validMoves.some(
        (move) => move.from === bestMove.substring(0, 2) && move.to === bestMove.substring(2, 4)
      );

      if (isValid) {
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.length > 4 ? bestMove.substring(4, 5) : "q",
        });
        setHistory([...history, game.fen()]);
        setRedoStack([]);
        setGame(new Chess(game.fen()));
      } else {
        console.warn("Stockfish предложил недопустимый ход:", bestMove);
      }
    });
  }, [engine, game, stockfishDepth, history]);

  const handlePieceDrop = (sourceSquare: string, targetSquare: string): boolean => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move) {
      setHistory([...history, game.fen()]);
      setRedoStack([]);
      setGame(new Chess(game.fen()));

      if (game.turn() === "b" && stockfishDepth) {
        setTimeout(makeStockfishMove, 500);
      }
      return true;
    }
    return false;
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      const lastFen = newHistory.pop();
      setRedoStack([game.fen(), ...redoStack]);
      game.load(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
      setGame(new Chess(game.fen()));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextFen = redoStack.shift();
      if (nextFen) {
        setHistory([...history, nextFen]);
        game.load(nextFen); 
        setGame(new Chess(game.fen()));
      }
    }
  };

  const handleRestart = () => {
    if (confirm("Перезапустить игру?")) {
      setGame(new Chess());
      setHistory([game.fen()]); 
      setRedoStack([]);
      setIsModalOpen(false);
    }
  };

  const handleFenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fen = e.target.value;
    try {
      game.load(fen);
      setGame(new Chess(fen));
      setHistory([fen]);
      setRedoStack([]);
    } catch (error) {
      console.error("Некорректный FEN:", error);
    }
  };

  const copyFenToClipboard = () => {
    navigator.clipboard.writeText(game.fen())
      .then(() => {
        setCopyStatus("✔️");
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch(err => console.error("Ошибка при копировании FEN:", err));
  };

  useEffect(() => {
    return () => {
      engine?.terminate();
    };
  }, [engine]);

  return (
    <>
      <div className={style.wrapperContainer} style={{ width: size }}>
        <ChessboardDnDProvider>
          <Chessboard
            id="CustomChessboard"
            position={game.fen()}
            onPieceDrop={handlePieceDrop}
            boardWidth={size}
            boardOrientation={boardOrientation}
          />
          {isFenVisible && (
            <div className="flex mt-5 gap-2">
              <Button size="small" style="gray" onClick={copyFenToClipboard}>
                {copyStatus || "FEN"}
              </Button>
              <input
                ref={inputRef}
                value={game.fen()}
                onChange={handleFenInputChange}
                placeholder="Введите FEN"
                className={style.fenInputField}
                style={{ width: "100%" }}
              />
            </div>
          )}
          {isTakebackAble && (
            <div className="flex mt-2 gap-2">
              <Button size="small" style="gray" onClick={handleUndo} disabled={history.length <= 1}>
                Undo ↩️
              </Button>
              <Button size="small" style="gray" onClick={handleRedo} disabled={redoStack.length === 0}>
                Redo ↪️
              </Button>
              <Button size="small" style="gray" onClick={handleRestart}>
                Restart 🗑️
              </Button>
            </div>
          )}
          <Button size="small" style="gray" onClick={() => setBoardOrientation(boardOrientation === "white" ? "black" : "white")}>
            Flip 🔄️
          </Button>
        </ChessboardDnDProvider>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Игра окончена"
        content={modalContent}
        onClose={handleRestart}
        buttons={[
          { text: "Новая игра", onClick: handleRestart, style: "bg-green-500 text-white hover:bg-green-600" },
        ]}
      />
    </>
  );
};

export default ChessBoardWrapper;
