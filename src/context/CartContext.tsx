// src/context/CartContext.tsx

import React, { createContext, useContext, useReducer, type ReactNode, useEffect } from 'react';

import type { CartContextType, CartItem, Product } from '../types';

// --- 1. Definir los "Tipos de Acciones" ---
// Estas son las "órdenes" que le podemos dar a nuestro carrito
type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// --- 2. Definir el Estado Inicial ---
interface CartState {
  cart: CartItem[];
}

// Función para cargar el carrito desde localStorage (para que no se borre al recargar)
const getInitialState = (): CartState => {
  try {
    const storedCart = localStorage.getItem('seoulstash_cart');
    if (storedCart) {
      return { cart: JSON.parse(storedCart) };
    }
  } catch (error) {
    console.error("Error al cargar el carrito de localStorage", error);
  }
  return { cart: [] };
};

const initialState: CartState = getInitialState();

// --- 3. El "Reducer": El Cerebro del Carrito ---
// Esta función recibe el estado actual y una acción,
// y devuelve un NUEVO estado.
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    // CASO: AÑADIR AL CARRITO
    case 'ADD_TO_CART': {
      const productToAdd = action.payload;
      const existingItem = state.cart.find(item => item.id === productToAdd.id);

      let newCart: CartItem[];

      if (existingItem) {
        // Si ya existe, solo aumenta la cantidad
        newCart = state.cart.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es nuevo, añádelo con cantidad 1
        newCart = [...state.cart, { ...productToAdd, quantity: 1 }];
      }
      return { ...state, cart: newCart };
    }

    // CASO: QUITAR DEL CARRITO
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.payload.id);
      return { ...state, cart: newCart };
    }

    // CASO: ACTUALIZAR CANTIDAD
    case 'UPDATE_QUANTITY': {
      // Si la nueva cantidad es 0, elimínalo
      if (action.payload.quantity <= 0) {
        const newCart = state.cart.filter(item => item.id !== action.payload.id);
        return { ...state, cart: newCart };
      }
      // Si no, actualiza la cantidad
      const newCart = state.cart.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, cart: newCart };
    }

    // CASO: VACIAR CARRITO
    case 'CLEAR_CART': {
      return { ...state, cart: [] };
    }

    default:
      return state;
  }
};

// --- 4. Crear el Contexto ---
// Lo inicializamos con 'undefined' porque el valor real
// vendrá del "Provider" de abajo.
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- 5. Crear el "Proveedor" (El Componente Envoltorio) ---
// Este es el componente que pondremos en main.tsx

interface CartProviderProps {
  children: ReactNode; // 'children' es la <App />
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Aquí conectamos el reducer
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    try {
      localStorage.setItem('seoulstash_cart', JSON.stringify(state.cart));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage", error);
    }
  }, [state.cart]);

  // --- Funciones "helper" ---
  // Creamos funciones fáciles de usar (ej. 'addToCart')
  // que por dentro "despachan" (dispatch) acciones al reducer.
  
  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id: productId } });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: newQuantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // --- Cálculos derivados ---
  // Calculamos el total de items y el precio total
  // CADA VEZ que el estado del carrito cambie.
  
  const itemCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // El "valor" que proveemos a todos los componentes hijos
  const value: CartContextType = {
    cart: state.cart,
    itemCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- 6. El "Hook" Personalizado ---
// Esta es la forma FÁCIL para que los componentes usen el contexto.
// En lugar de importar 'useContext' y 'CartContext' en cada archivo,
// solo importarán 'useCart()'.

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};