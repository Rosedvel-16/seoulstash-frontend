// src/main.tsx (Actualizado)
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/Wishlist/WishlistContext';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
    <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </CartProvider>
  </React.StrictMode>
);