"use client"

import Board from "./components/Chessboard/Chessboard";


export default function Home() {

  return (
    <>
      <Board 
      areTakebacksAble={true}
      showFen={true}/>
    </>

  );
}
