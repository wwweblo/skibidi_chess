import React, { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';

interface BoardProps {
  size?: number;
  showFen?: boolean;
  areTakebacksAble?: boolean;
}

const Board: React.FC<BoardProps> = ({ size = 400, showFen = false, areTakebacksAble = false }) => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<Record<string, { background: string; borderRadius?: string }>>({});
  const [fen, setFen] = useState(game.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [currentMove, setCurrentMove] = useState(0);

  useEffect(() => {
    setFen(game.fen());
    setHistory(prev => [...prev.slice(0, currentMove), game.fen()]);
  }, [game]);

  const getMoveOptions = (square: Square) => {
    const moves = game.moves({ square, verbose: true }) as { from: Square; to: Square }[];
    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }
    const newSquares: Record<string, { background: string; borderRadius?: string }> = {};
    moves.forEach(move => {
      newSquares[move.to] = {
        background: game.get(move.to) ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)" : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%"
      };
    });
    newSquares[square] = { background: "rgba(255, 255, 0, 0.4)" };
    setOptionSquares(newSquares);
  };

  const onSquareClick = (square: Square) => {
    if (moveFrom) {
      const move = game.move({ from: moveFrom, to: square, promotion: 'q' });
      if (move) {
        setGame(new Chess(game.fen()));
        setCurrentMove(prev => prev + 1);
      }
      setMoveFrom(null);
      setOptionSquares({});
      return;
    }
    
    if (game.get(square)) {
      getMoveOptions(square);
      setMoveFrom(square);
    }
  };

  const onPieceDragBegin = (_piece: string, sourceSquare: Square) => {
    getMoveOptions(sourceSquare);
    setMoveFrom(sourceSquare);
  };

  const onPieceDrop = (sourceSquare: Square, targetSquare: Square) => {
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (move) {
      setGame(new Chess(game.fen()));
      setCurrentMove(prev => prev + 1);
    }
    setMoveFrom(null);
    setOptionSquares({});
    return Boolean(move);
  };

  const onFenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFen = event.target.value;
    const newGame = new Chess();
    if (newGame.load(newFen)) {
      setGame(newGame);
    }
    setFen(newFen);
  };

  const takeBack = () => {
    if (currentMove > 0) {
      const newGame = new Chess();
      newGame.load(history[currentMove - 1]);
      setGame(newGame);
      setCurrentMove(prev => prev - 1);
    }
  };

  const redoMove = () => {
    if (currentMove < history.length - 1) {
      const newGame = new Chess();
      newGame.load(history[currentMove + 1]);
      setGame(newGame);
      setCurrentMove(prev => prev + 1);
    }
  };

  return (
    <div>
      <Chessboard 
        position={fen} 
        onSquareClick={onSquareClick} 
        onPieceDragBegin={onPieceDragBegin} 
        onPieceDrop={onPieceDrop} 
        boardWidth={size} 
        customSquareStyles={optionSquares}
      />
      {areTakebacksAble && (
        <div style={{ width: size, display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <button onClick={takeBack} disabled={currentMove === 0}>Undo</button>
          <button onClick={redoMove} disabled={currentMove >= history.length - 1}>Redo</button>
        </div>
      )}
      {showFen && (
        <div style={{width: size, display: 'flex', marginTop: 10}}>
          <p>FEN:</p>
          <input 
            type="text" 
            value={fen} 
            onChange={onFenChange} 
            style={{ width: size, textAlign: 'center', borderRadius: 8 }}
        />
        </div>
      )}
    </div>
  );
};

export default Board;