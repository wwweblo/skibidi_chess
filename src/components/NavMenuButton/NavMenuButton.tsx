"use client";
import React, { useState } from "react";
import styles from "./NavMenuButton.module.css";

export interface MenuItem {
  label: string;
  link: string;
  description?: string;
}

const defaultMenuItems: MenuItem[] = [
  { label: "Wikipedia", link: "https://en.wikipedia.org/wiki/Main_Page", description: "Свободная энциклопедия" },
  { label: "Next.js", link: "https://nextjs.org/", description: "Современный фреймворк для React" }
];

interface NavMenuButtonProps {
  label: string;
  items?: MenuItem[];
  variant?: "ghost" | "neutral" | "info";
}

const NavMenuButton: React.FC<NavMenuButtonProps> = ({
  label,
  items = defaultMenuItems,
  variant = "neutral"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={styles.menuContainer}>
      {/* ✅ Исправленный `className`, чтобы не было `undefined` */}
      <button onClick={toggleMenu} className={`${styles.menuButton} ${styles[variant] || ""}`}>
        {label} <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className={`${styles.dropdown} ${styles[`${variant}-menu`] || ""}`}>
          <ul className={styles.menuList}>
            {items.map((item, index) => (
              <li key={index} className={styles.menuItem}>
                <a href={item.link} className={styles.menuLink}>
                  <div className={styles.menuLabel}>{item.label}</div>
                  {item.description && <div className={styles.menuDescription}>{item.description}</div>}
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
