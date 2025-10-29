// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

// 1. Importa el Header
import Header from './Header/Header'; 
// 2. Importa el Footer
import Footer from './Footer/Footer';

const Layout: React.FC = () => {
  return (
    <div className="app-layout">

      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />

    </div>
  );
};

export default Layout;