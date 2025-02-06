import NavMenuButton from "./components/Menu/NavMenuButton";
import type { MenuItem } from "./components/Menu/NavMenuButton";

export default function Home() {
  const menuItems: MenuItem[] = [
    { label: "Who we are", link: "#", description: "Amplifying human creativity." },
    { label: "Stories & Insight", link: "#", description: "Discover the latest news." },
    { label: "Press", link: "#", description: "Media and editorial resources." },
    { label: "Careers", link: "#", description: "Join the Procreate team." },
  ];

  return (
    <NavMenuButton label="Menu" />
  );
}
