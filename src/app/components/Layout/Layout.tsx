import React, { ReactNode } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import NavMenuButton, {MenuItem} from '../NavMenuButton/NavMenuButton';

interface LayoutProps {
  children?: ReactNode;
}

const nav: MenuItem[] = [
  {label: "Main Page", link: "http://localhost:3000/", description: "home sweet home"},
  { label: "Opeinigs", link: "http://localhost:3000/database", description: "update your knowlage" },
];

const play: MenuItem[] = [
  {label: "...with bot", link: "http://localhost:3000/play/bot", description: "test yourself"}
];

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <main>
      <Header>
        <div className='flex gap-4'>
          Chess.skibidi
          <NavMenuButton label='Data' style='p-5' items={nav}/>
          <NavMenuButton label='Play' style='p-5' items={play}/>
        </div>
      </Header>
      {children}
      <Footer></Footer>
    </main>
  );
};

export default Layout;
