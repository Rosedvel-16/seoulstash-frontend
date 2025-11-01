// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme, ThemeContextType } from '../types'; // Importamos los nuevos tipos

// --- 1. Función para obtener el tema inicial ---
// Comprueba localStorage O la preferencia del sistema
const getInitialTheme = (): Theme => {
  // 1. Comprueba si el usuario YA guardó una preferencia
  const storedTheme = localStorage.getItem('theme') as Theme;
  if (storedTheme) {
    return storedTheme;
  }
  
  // 2. Si no, comprueba la preferencia de su Sistema Operativo
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // 3. Por defecto, es 'light'
  return 'light';
};

// --- 2. Crear el Contexto ---
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// --- 3. Crear el "Proveedor" ---
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 4. Creamos el estado, usando nuestra función para el valor inicial
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // 5. ¡LA MAGIA! Este useEffect se ejecuta cada vez que 'theme' cambia
  useEffect(() => {
    // 1. Aplica el atributo 'data-theme' al <body>
    // (Nuestro index.css reaccionará a esto)
    document.body.setAttribute('data-theme', theme);
    
    // 2. Guarda la preferencia en localStorage para el futuro
    localStorage.setItem('theme', theme);
  }, [theme]); // Se ejecuta al inicio y cada vez que 'theme' cambia

  // 6. La función para cambiar el tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // El valor que proveemos a la app
  const value: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// --- 7. El "Hook" Personalizado ---
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};