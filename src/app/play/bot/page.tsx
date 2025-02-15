"use client";
import React, { useState } from "react";
import ChessBoardWrapper from "@/app/components/ChessBoardWrapper/ChessBoardWrapper";

const ChessPage = () => {
  const [stockfishDepth, setStockfishDepth] = useState<number>(12);

  return (

      <ChessBoardWrapper 
        isFenVisible={true} 
        isTakebackAble={true} 
        size={500} 
        stockfishDepth={stockfishDepth} 
      />
      
  );
};

export default ChessPage;
