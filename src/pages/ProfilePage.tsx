import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { FiUser, FiHeart, FiPackage, FiLogOut, FiCreditCard } from 'react-icons/fi';

// 1. AÑADIMOS 'export' AQUÍ
export const ProfilePage: React.FC = () => {
  const userName = "SeoulStash Fan"; 
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('¡Sesión cerrada! (Simulación)');
    navigate('/'); 
  };

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
          
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FiLogOut />
            <span>Cerrar Sesión</span>
          </button>
        </aside>

        <main className={styles.contentArea}>
          <Outlet context={{ userName }} /> 
        </main>

      </div>
    </div>
  );
};

export const ProfileWelcome: React.FC = () => {
  const userName = "SeoulStash Fan"; 
  
  return (
    <div>
      <h2>¡Bienvenido, <span>{userName}</span>!</h2>
      <p className={styles.welcomeMessage}>
        Desde aquí puedes administrar tu cuenta. Revisa tus pedidos,
        actualiza tu wishlist y administra tus métodos de pago.
      </p>
    </div>
  );
};

export const ProfileOrders: React.FC = () => {
  return (
    <div>
      <h2>Mis Pedidos</h2>
      <p className={styles.welcomeMessage}>
        Aún no tienes pedidos. ¡Esperamos que encuentres algo que te encante!
        (Esta es una maqueta de la página de pedidos).
      </p>
    </div>
  );
};