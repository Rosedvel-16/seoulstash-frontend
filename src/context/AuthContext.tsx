import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  type User 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db, auth } from '../services/firebaseConfig';
import type { AuthContextType, AppUser } from '../types'; 

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true); 
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 2. Usamos 'auth' (importado de firebaseConfig), por eso 'getAuth' sobraba
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        let appUser: AppUser;

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          appUser = {
            uid: user.uid,
            email: user.email,
            displayName: userData.displayName || user.displayName, 
            role: userData.role || 'customer'
          };
        } else {
          appUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName, 
            role: 'customer'
          };
        }
        
        setCurrentUser(appUser);
        setIsAdmin(appUser.role === 'admin');
        
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: displayName
    });

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName, 
      role: 'customer'
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    isAdmin,
    login,
    register,
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