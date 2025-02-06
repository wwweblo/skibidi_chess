"use client";
import React, { useState } from "react";
import styles from "./NavMenuButton.module.css";

export interface MenuItem {
  label: string;
  link: string;
  description?: string;
}

const defaultMenuItems: MenuItem[] = [
  { label: "Wikipedia", link: "https://en.wikipedia.org/wiki/Main_Page", description: "the free encyclopedia that anyone can edit" },
  { label: "Next js", link: "https://nextjs.org/", description: "Used by some of the world's largest companies" }
];

interface NavMenuButtonProps {
  label: string,
  items?: MenuItem[]
}
const NavMenuButton: React.FC<NavMenuButtonProps> = ({
  label,
  items = defaultMenuItems}
) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.menuContainer}>
      {/* Кнопка */}
      <button onClick={toggleMenu} className={styles.menuButton}>
        {label} <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Раскрывающееся меню */}
      {isOpen && (
        <div className={styles.dropdown}>
          <ul className={styles.menuList}>
            {items.map((item, index) => (
              <li key={index} className={styles.menuItem}>
                <a href={item.link} className={styles.menuLink}>
                  <div className={styles.menuLabel}>{item.label}</div>
                  <div className={styles.menuDescription}>{item.description}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavMenuButton;
