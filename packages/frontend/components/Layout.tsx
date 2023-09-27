import React, { ReactNode } from 'react';
import NavBar from './NavBar';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
    </div>
  );
};

export default Layout;
