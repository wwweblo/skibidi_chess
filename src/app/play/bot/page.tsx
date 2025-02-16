"use client";
import React, { useState, useEffect, useRef } from "react";
import ChessBoardWrapper from "@/app/components/ChessBoardWrapper/ChessBoardWrapper";
import Button from "@/app/components/Button/Button";
import Engine from "@/utils/stockfishEngine";

const ChessPage = () => {
  const [stockfishDepth, setStockfishDepth] = useState<number>(12);
  const [isBotEnabled, setIsBotEnabled] = useState<boolean>(true);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (isBotEnabled && stockfishDepth) {
      engineRef.current = new Engine();
      console.log("Stockfish engine initialized.");
    } else {
      engineRef.current?.terminate();
      engineRef.current = null;
      console.log("Stockfish engine disabled.");
    }
    return () => engineRef.current?.terminate();
  }, [isBotEnabled, stockfishDepth]);

  const handleDepthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDepth = parseInt(event.target.value, 10);
    if (!isNaN(newDepth) && newDepth > 0) {
      setStockfishDepth(newDepth);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-4 mb-4">
        <Button onClick={() => setIsBotEnabled(!isBotEnabled)}>
          {isBotEnabled ? "Disable Bot" : "Enable Bot"}
        </Button>
        {isBotEnabled && (
          <input
            type="number"
            value={stockfishDepth}
            onChange={handleDepthChange}
            min="1"
            className="border p-1 rounded"
          />
        )}
      </div>
      <ChessBoardWrapper 
        isFenVisible={true} 
        isTakebackAble={true} 
        size={500} 
        stockfishDepth={isBotEnabled ? stockfishDepth : undefined} 
        onFenChange={(fen) => console.log("Updated FEN:", fen)}
      />
    </div>
  );
};

export default ChessPage;
