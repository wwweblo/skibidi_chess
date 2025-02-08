"use client"
import NavMenuButton from "./components/DropdownMenu/DropdownMenu";
import type { MenuItem } from "./components/DropdownMenu/DropdownMenu";
import Button from "./components/Button/Button";
import Board from './components/Chessboard/Board'
import { useState } from "react";

export default function Home() {
  const menuItems: MenuItem[] = [
    { label: "Who we are", link: "#", description: "Amplifying human creativity." },
    { label: "Stories & Insight", link: "#", description: "Discover the latest news." },
    { label: "Press", link: "#", description: "Media and editorial resources." },
    { label: "Careers", link: "#", description: "Join the Procreate team." },
  ];

  return (
    <>
      <Board size={300}/>
    </>

  );
}
