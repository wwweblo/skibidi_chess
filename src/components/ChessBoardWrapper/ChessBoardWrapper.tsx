import React, { useEffect, useRef, useState, useMemo } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard, ChessboardDnDProvider } from "react-chessboard";
import style from './ChessBoardWrapper.module.css';
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
    if (engine) {
      const handleMessage = ({ bestMove }: { bestMove?: string }) => {
        if (bestMove) {
          game.move(bestMove);
          setFenPosition(game.fen());
          setHistory((prevHistory) => [...prevHistory, game.history({ verbose: true }).pop() as Move]);
          onFenChange?.(game.fen());
        }
      };

      engine.onMessage(handleMessage);

      return () => {
        engine.terminate();
      };
    }
  }, [engine]);

  const handleFenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fen = e.target.value;
    try {
      game.load(fen);
      setFenPosition(game.fen());
      onFenChange?.(game.fen());
      setHistory([]);
      setRedoStack([]);
    } catch (error) {
      console.error("Некорректный FEN:", error);
    }
  };

  const handlePieceDrop = (sourceSquare: string, targetSquare: string, piece: string): boolean => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1]?.toLowerCase() ?? "q",
    });

    if (move) {
      setFenPosition(game.fen());
      setHistory([...history, move]);
      setRedoStack([]);
      onFenChange?.(game.fen());
      
      if (stockfishDepth) {
        console.log(`Stockfish evaluating position: ${game.fen()}`);
        engine?.evaluatePosition(game.fen(), stockfishDepth);
      }
      return true;
    }
    return false;
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastMove = history.pop();
      game.undo();
      setFenPosition(game.fen());
      setRedoStack([lastMove!, ...redoStack]);
      onFenChange?.(game.fen());
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextMove = redoStack.shift();
      game.move(nextMove!);
      setFenPosition(game.fen());
      setHistory([...history, nextMove!]);
      onFenChange?.(game.fen());
    }
  };

  const handleRestart = () => {
    if (confirm("Restart the game?")) {
      game.reset();
      setFenPosition(game.fen());
      setHistory([]);
      setRedoStack([]);
      onFenChange?.(game.fen());
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
              Restart 🗑️
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
