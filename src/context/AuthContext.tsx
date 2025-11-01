import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile, // <-- ¡NUEVA IMPORTACIÓN!
  type User 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db, auth } from '../services/firebaseConfig';
import type { AuthContextType, AppUser } from '../types'; // Importará la nueva 'AppUser'

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // --- Usuario HA iniciado sesión ---
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        let appUser: AppUser;

        if (userDocSnap.exists()) {
          // Si el usuario existe en Firestore, leemos sus datos
          const userData = userDocSnap.data();
          appUser = {
            uid: user.uid,
            email: user.email,
            // ¡Leemos el nombre y el rol desde Firestore!
            displayName: userData.displayName || user.displayName, // Fallback al de Auth
            role: userData.role || 'customer'
          };
        } else {
          // Fallback si no existe el documento (no debería pasar)
          appUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName, // Leemos desde el perfil de Auth
            role: 'customer'
          };
        }
        
        setCurrentUser(appUser);
        setIsAdmin(appUser.role === 'admin');
        
      } else {
        // --- Usuario NO ha iniciado sesión ---
        setCurrentUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  // --- Funciones de Autenticación ---

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  // --- ¡FUNCIÓN 'register' ACTUALIZADA! ---
  // Ahora acepta 'displayName'
  const register = async (email: string, pass: string, displayName: string) => {
    // 1. Crea el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // 2. ¡NUEVO! Actualiza el perfil de Authentication
    // Esto guarda el nombre en el objeto 'user' de Firebase
    await updateProfile(user, {
      displayName: displayName
    });

    // 3. ¡ACTUALIZADO! Creamos el documento en FIRESTORE
    //    con el rol Y el nuevo displayName.
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName, // <-- ¡Guardamos el nombre!
      role: 'customer'
    });
    
    // El listener onAuthStateChanged se activará y leerá estos datos
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    isAdmin,
    login,
    register, // <-- Esta función ahora coincide con la de types.ts
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};