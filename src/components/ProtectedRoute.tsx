// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // 1. Muestra un loader mientras Firebase comprueba la sesión
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  // 2. Si no está cargando Y no hay usuario, redirige a /login
  if (!currentUser) {
    // 'replace' evita que el usuario pueda "volver" a la página de carga
    return <Navigate to="/login" replace />;
  }

  // 3. Si hay usuario, muestra la página solicitada (el 'children')
  // 'children' será nuestra <ProfilePage />
  return <>{children}</>;
};

export default ProtectedRoute;