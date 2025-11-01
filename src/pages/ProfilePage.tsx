import React from 'react';
import { NavLink, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import styles from './ProfilePage.module.css';
// 1. ¡Importamos un ícono nuevo para el panel de admin!
import { FiUser, FiHeart, FiPackage, FiLogOut, FiCreditCard, FiShield } from 'react-icons/fi';

import { useAuth } from '../context/AuthContext'; 

export const ProfilePage: React.FC = () => {
  // 2. ¡Ahora también pedimos 'isAdmin'!
  const { currentUser, logout, isAdmin } = useAuth();
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); 
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  if (!currentUser) {
    return (
      <div className={`container ${styles.page}`}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.pageTitle}>Mi Cuenta</h1>

      <div className={styles.profileGrid}>
        
        <aside className={styles.profileNav}>
          <NavLink to="/profile" end>
            <FiUser />
            <span>Perfil</span>
          </NavLink>
          <NavLink to="/profile/orders">
            <FiPackage />
            <span>Mis Pedidos</span>
          </NavLink>
          <NavLink to="/wishlist">
            <FiHeart />
            <span>Mi Wishlist</span>
          </NavLink>
          <NavLink to="/profile/payment">
            <FiCreditCard />
            <span>Métodos de Pago</span>
          </NavLink>

          {/* 4. ¡ENLACE CONDICIONAL DE ADMIN! */}
          {/* Esto solo se muestra si 'isAdmin' es true */}
          {isAdmin && (
            <NavLink to="/admin/add-product" className={styles.adminLink}>
              <FiShield />
              <span>Panel de Admin</span>
            </NavLink>
          )}
          
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FiLogOut />
            <span>Cerrar Sesión</span>
          </button>
        </aside>

        <main className={styles.contentArea}>
          <Outlet context={{ displayName: currentUser.displayName }} /> 
        </main>

      </div>
    </div>
  );
};

// --- Componentes (sin cambios) ---

export const ProfileWelcome: React.FC = () => {
  const { displayName } = useOutletContext<{ displayName: string | null }>();
  return (
    <div>
      <h2>¡Bienvenido, <span>{displayName || 'Fan'}</span>!</h2>
      <p className={styles.welcomeMessage}>
        Desde aquí puedes administrar tu cuenta.
      </p>
    </div>
  );
};

export const ProfileOrders: React.FC = () => {
  return (
    <div>
      <h2>Mis Pedidos</h2>
      <p className={styles.welcomeMessage}>
        Aún no tienes pedidos.
      </p>
    </div>
  );
};