'use client'

import React, { ReactNode, useEffect, useState } from 'react';
import style from './Header.module.css';
import Button from '../Button/Button';



interface HeaderProps {
  children?: ReactNode;
}

// Функция для переключения темы
function toggleTheme(setCurrentTheme: React.Dispatch<React.SetStateAction<string>>): void {
  const htmlElement = document.documentElement;

  // Проверяем текущую тему и переключаем
  if (htmlElement.getAttribute('data-theme') === 'dark') {
    htmlElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light'); // Сохраняем светлую тему
    setCurrentTheme('light'); // Обновляем состояние темы
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark'); // Сохраняем темную тему
    setCurrentTheme('dark'); // Обновляем состояние темы
  }
}

const Header: React.FC<HeaderProps> = ({
    children = <h1 className='text-center'>Header</h1>
 }) => {
  
  const [currentTheme, setCurrentTheme] = useState<string>('light'); // Состояние для текущей темы

  useEffect(() => {
    // При монтировании компонента проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setCurrentTheme(savedTheme); // Устанавливаем состояние на основе сохраненной темы
    }
  }, []);

  return (
    <div className={style.container}>
      <header className={style.Header}>
        {/* Theme butoon */}
        <Button 
          size='small'
          onClick={() => toggleTheme(setCurrentTheme)}
        >
          {currentTheme === 'dark' ? '🌙' : '☀️'} {/* Солнце или луна в зависимости от темы */}
        </Button>

        <div className={style.childrenContainer}>
          {children}
        </div>
      </header>
    </div>
  );
};

export default Header;