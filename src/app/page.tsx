"use client";

import { useState } from "react";
import ChessBoardWpapper from "../components/ChessBoardWrapper/ChessBoardWrapper";

export default function Home() {

  return (
    <div className="m-10">
      <ChessBoardWpapper
        isFenVisible={true} />
    </div>
  );
}
