import React, { ReactNode } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import NavMenuButton from '../DropdownMenu/DropdownMenu';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <main>
      <Header>
        <b>Chess</b>.skibidi
        <NavMenuButton label='nav button' style='p-5'/>
      </Header>
      {children}
      <Footer></Footer>
    </main>
  );
};

export default Layout;
