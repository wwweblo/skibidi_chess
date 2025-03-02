// components/ChessBoardWrapper/ChessboardDisplay.tsx
import React from "react";
import { Chessboard, ChessboardDnDProvider } from "react-chessboard";

interface ChessboardDisplayProps {
  fenPosition: string;
  size: number;
  boardOrientation: "white" | "black";
  onPieceDrop: (sourceSquare: string, targetSquare: string, piece: string) => boolean;
}

const ChessboardDisplay: React.FC<ChessboardDisplayProps> = ({
  fenPosition,
  size,
  boardOrientation,
  onPieceDrop
}) => {
  return (
    <ChessboardDnDProvider>
      <Chessboard
        id="CustomChessboard"
        position={fenPosition}
        onPieceDrop={onPieceDrop}
        boardWidth={size}
        boardOrientation={boardOrientation}
      />
    </ChessboardDnDProvider>
  );
};

export default ChessboardDisplay;
