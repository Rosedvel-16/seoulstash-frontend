import React from 'react';
// 1. ¡Importamos Outlet!
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // (Asegúrate que la ruta sea correcta)

// 2. Ya no necesita 'children' en las props
const ProtectedRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  // 3. Si hay usuario, renderiza el <Outlet /> (que cargará la ruta hija)
  // Si no, redirige a /login
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;