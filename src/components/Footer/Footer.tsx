import React, { ReactNode } from 'react';

interface FooterProps {
  children?: ReactNode;
}

const Footer: React.FC<FooterProps> = ({
    children = <h1 className='text-center'>Footer</h1>
    }) => {
  return (
    <main>
        {children}
    </main>
  );
};

export default Footer;
