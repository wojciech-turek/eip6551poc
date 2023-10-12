import React, { ReactNode } from 'react';
import NavBar from './NavBar';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="overflow-auto min-h-screen h-full bg-gradient-to-r from-sky-500 to-sky-500">
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
