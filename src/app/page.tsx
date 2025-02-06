"use client"
import NavMenuButton from "./components/Menu/NavMenuButton";
import type { MenuItem } from "./components/Menu/NavMenuButton";
import Button from "./components/Button/Button";

export default function Home() {
  const menuItems: MenuItem[] = [
    { label: "Who we are", link: "#", description: "Amplifying human creativity." },
    { label: "Stories & Insight", link: "#", description: "Discover the latest news." },
    { label: "Press", link: "#", description: "Media and editorial resources." },
    { label: "Careers", link: "#", description: "Join the Procreate team." },
  ];

  function check() {
    alert("Cliked")
  }

  return (
    <>
      <NavMenuButton label="Menu" items={menuItems}/>
      <Button onClick={check}>Click</Button>

    </>

  );
}
