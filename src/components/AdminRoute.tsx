// src/components/AdminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // 1. Obtenemos el usuario, el estado de carga Y si es admin
  const { currentUser, loading, isAdmin } = useAuth();

  // 2. Muestra un loader mientras Firebase comprueba la sesión
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Verificando permisos...</h2>
      </div>
    );
  }

  // 3. Si no está cargando Y (no hay usuario O no es admin)
  if (!currentUser || !isAdmin) {
    // Redirige a la página de inicio.
    // Un 'customer' no debe saber que la página de admin existe.
    return <Navigate to="/" replace />;
  }

  // 4. Si hay usuario Y es admin, muestra la página solicitada
  return <>{children}</>;
};

export default AdminRoute;