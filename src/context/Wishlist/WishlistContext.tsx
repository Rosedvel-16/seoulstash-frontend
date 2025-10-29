// src/context/Wishlist/WishlistContext.tsx

import React, { createContext, useContext, useReducer, type ReactNode, useEffect } from 'react';
// ¡ESTA LÍNEA ESTÁ CORREGIDA! (Cambiamos ../../../ por ../../)
import type { WishlistContextType, WishlistItem, Product } from '../../types';

// --- 1. Definir los "Tipos de Acciones" ---
type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: { id: string } };

// --- 2. Definir el Estado Inicial ---
interface WishlistState {
  wishlist: WishlistItem[];
}

// Función para cargar la wishlist desde localStorage
const getInitialState = (): WishlistState => {
  try {
    const storedWishlist = localStorage.getItem('seoulstash_wishlist');
    if (storedWishlist) {
      return { wishlist: JSON.parse(storedWishlist) };
    }
  } catch (error) {
    console.error("Error al cargar la wishlist de localStorage", error);
  }
  return { wishlist: [] };
};

const initialState: WishlistState = getInitialState();

// --- 3. El "Reducer": El Cerebro de la Wishlist ---
const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    // CASO: AÑADIR A WISHLIST
    case 'ADD_TO_WISHLIST': {
      const productToAdd = action.payload;
      // Evitamos duplicados
      const existingItem = state.wishlist.find(item => item.id === productToAdd.id);
      
      if (existingItem) {
        return state; // Ya existe, no hacemos nada
      }
      
      const newWishlist = [...state.wishlist, productToAdd];
      return { ...state, wishlist: newWishlist };
    }

    // CASO: QUITAR DE WISHLIST
    case 'REMOVE_FROM_WISHLIST': {
      const newWishlist = state.wishlist.filter(item => item.id !== action.payload.id);
      return { ...state, wishlist: newWishlist };
    }

    default:
      return state;
  }
};

// --- 4. Crear el Contexto ---
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// --- 5. Crear el "Proveedor" ---
interface WishlistProviderProps {
  children: ReactNode; // 'children' es la <App />
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Guardar en localStorage cada vez que la wishlist cambie
  useEffect(() => {
    try {
      localStorage.setItem('seoulstash_wishlist', JSON.stringify(state.wishlist));
    } catch (error) {
      console.error("Error al guardar la wishlist en localStorage", error);
    }
  }, [state.wishlist]);

  // --- Funciones "helper" ---
  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: { id: productId } });
  };

  // Función helper para que los botones sepan si el item ya está
  const isInWishlist = (productId: string): boolean => {
    return state.wishlist.some(item => item.id === productId);
  };

  // --- Cálculos derivados ---
  const itemCount = state.wishlist.length;

  // El "valor" que proveemos
  const value: WishlistContextType = {
    wishlist: state.wishlist,
    itemCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// --- 6. El "Hook" Personalizado ---
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist debe ser usado dentro de un WishlistProvider');
  }
  return context;
};