import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// 1. Importa todos los proveedores
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/Wishlist/WishlistContext'; // Tu ruta
import { AuthProvider } from './context/AuthContext';
// 2. ¡Importa el nuevo proveedor de Tema!
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
    
  </React.StrictMode>
);