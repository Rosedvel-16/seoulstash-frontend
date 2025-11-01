// src/services/firebaseConfig.ts

// Importar las funciones que necesitamos de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 1. Leer las variables de entorno (con el prefijo VITE_ que usa Vite)
// El 'import.meta.env' es la forma en que Vite accede al .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 2. Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// 3. Exportar los servicios que usaremos en la aplicación
// Exportamos 'auth' para el Login/Registro
// Exportamos 'db' para la base de datos Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Exportamos 'app' por si lo necesitamos para otros servicios (como Storage)
export default app;