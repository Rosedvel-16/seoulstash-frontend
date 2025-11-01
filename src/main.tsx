import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// 1. Importa todos los proveedores
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/Wishlist/WishlistContext'; 
import { AuthProvider } from './context/AuthContext'; // ¡El nuevo!

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    
  </React.StrictMode>
);