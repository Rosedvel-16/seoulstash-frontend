import React from 'react';
// 1. ¡Importamos Outlet!
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // (Asegúrate que la ruta sea correcta)

// 2. Ya no necesita 'children' en las props
const AdminRoute: React.FC = () => {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Verificando permisos...</h2>
      </div>
    );
  }

  // 3. Si hay usuario Y es admin, renderiza el <Outlet />
  // Si no, redirige a la HomePage
  return (currentUser && isAdmin) ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;