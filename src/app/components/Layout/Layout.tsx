import React, { ReactNode } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import NavMenuButton, {MenuItem} from '../NavMenuButton/NavMenuButton';

interface LayoutProps {
  children?: ReactNode;
}

const nav: MenuItem[] = [
  {label: "Main Page", link: "http://localhost:3000/", description: "home sweet home"},
  { label: "Opeinigs", link: "http://localhost:3000/openings", description: "update your knowlage" },
];

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <main>
      <Header>
        <b>Chess</b>.skibidi
        <NavMenuButton label='Data' style='p-5' items={nav}/>
      </Header>
      {children}
      <Footer></Footer>
    </main>
  );
};

export default Layout;
