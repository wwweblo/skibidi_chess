import React, { ReactNode } from 'react';
import style from './Header.module.css';

interface HeaderProps {
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({
    children = <h1 className='text-center'>Header</h1>
 }) => {
  return (
    <header className={style.Header}>
        {children}
    </header>
  );
};

export default Header;
