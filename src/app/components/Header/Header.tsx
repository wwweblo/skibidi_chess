'use client'

import React, { ReactNode } from 'react';
import style from './Header.module.css';
import Button from '../Button/Button';

interface HeaderProps {
  children?: ReactNode;
}

// Функция для переключения темы
function toggleTheme(): void {
  const htmlElement = document.documentElement;

  if (htmlElement.getAttribute('data-theme') === 'dark') {
    htmlElement.removeAttribute('data-theme');
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
  }
}

const Header: React.FC<HeaderProps> = ({
    children = <h1 className='text-center'>Header</h1>
 }) => {
  return (
    <header className={style.Header}>
      <Button style='gray' size='small' onClick={toggleTheme}>toggle</Button>
        {children}
    </header>
  );
};

export default Header;
