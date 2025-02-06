import React, { ReactNode } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <main>
      <Header><b>Chess</b>.skibidi</Header>
      {children}
      <Footer></Footer>
    </main>
  );
};

export default Layout;
