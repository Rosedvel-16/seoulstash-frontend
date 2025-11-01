import React from 'react';
import { NavLink, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import styles from './ProfilePage.module.css';
// 1. Importamos ícono de "Editar"
import { FiUser, FiHeart, FiPackage, FiLogOut, FiCreditCard, FiShield, FiEdit } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; 

export const ProfilePage: React.FC = () => {
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
          {/* ... (Enlaces de Cliente sin cambios) ... */}
          <NavLink to="/profile" end><FiUser /><span>Perfil</span></NavLink>
          <NavLink to="/profile/orders"><FiPackage /><span>Mis Pedidos</span></NavLink>
          <NavLink to="/wishlist"><FiHeart /><span>Mi Wishlist</span></NavLink>
          <NavLink to="/profile/payment"><FiCreditCard /><span>Métodos de Pago</span></NavLink>

          {/* Enlaces de Admin */}
          {isAdmin && (
            <div className={styles.adminSection}> {/* 2. (Opcional) Wrapper */}
              <NavLink to="/admin/add-product" className={styles.adminLink}>
                <FiShield />
                <span>Añadir Producto</span>
              </NavLink>
              {/* 3. ¡NUEVO ENLACE! */}
              <NavLink to="/admin/manage-products" className={styles.adminLink}>
                <FiEdit />
                <span>Ver/Eliminar Inventario</span>
              </NavLink>
            </div>
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