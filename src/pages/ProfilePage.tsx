import React, { useState, useEffect } from 'react'; // ¡Importa useState y useEffect!
import { NavLink, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { FiUser, FiHeart, FiPackage, FiLogOut, FiCreditCard, FiShield, FiEdit } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; 

// --- Importaciones para "Mis Pedidos" ---
import { getOrdersForUser } from '../services/api';
import type { Order } from '../types';
import orderItemStyles from './OrderItem.module.css'; // Estilos para la tarjeta de pedido

// (El componente ProfilePage principal no cambia)
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
    return <div className={`container ${styles.page}`}><p>Cargando...</p></div>;
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.pageTitle}>Mi Cuenta</h1>
      <div className={styles.profileGrid}>
        <aside className={styles.profileNav}>
          <NavLink to="/profile" end><FiUser /><span>Perfil</span></NavLink>
          <NavLink to="/profile/orders"><FiPackage /><span>Mis Pedidos</span></NavLink>
          <NavLink to="/wishlist"><FiHeart /><span>Mi Wishlist</span></NavLink>
          <NavLink to="/profile/payment"><FiCreditCard /><span>Métodos de Pago</span></NavLink>
          {isAdmin && (
            <div className={styles.adminSection}>
              <NavLink to="/admin/add-product" className={styles.adminLink}><FiShield /><span>Añadir Producto</span></NavLink>
              <NavLink to="/admin/manage-products" className={styles.adminLink}><FiEdit /><span>Ver/Eliminar Inventario</span></NavLink>
            </div>
          )}
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FiLogOut /><span>Cerrar Sesión</span>
          </button>
        </aside>
        <main className={styles.contentArea}>
          <Outlet context={{ displayName: currentUser.displayName, email: currentUser.email }} /> 
        </main>
      </div>
    </div>
  );
};


// --- Componente 'ProfileWelcome' (sin cambios por ahora) ---
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


// --- ¡COMPONENTE 'ProfileOrders' ACTUALIZADO! ---
export const ProfileOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); // Necesitamos el ID del usuario

  useEffect(() => {
    if (!currentUser) return; // Si no hay usuario, no busques

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userOrders = await getOrdersForUser(currentUser.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]); // Se ejecuta cuando 'currentUser' está listo

  if (loading) {
    return <h2>Cargando mis pedidos...</h2>;
  }

  return (
    <div>
      <h2>Mis Pedidos</h2>
      {orders.length === 0 ? (
        <p className={styles.welcomeMessage}>
          Aún no tienes pedidos. ¡Esperamos que encuentres algo que te encante!
        </p>
      ) : (
        <div className={orderItemStyles.orderList}>
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Componente helper para mostrar cada pedido ---
// (Lo ponemos aquí mismo para no crear más archivos)
const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  // Función para formatear Fechas de Firebase
  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return 'Fecha inválida';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };
  
  // Función para formatear precios
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <div className={orderItemStyles.orderCard}>
      <header className={orderItemStyles.orderHeader}>
        <div>
          <p>FECHA DEL PEDIDO</p>
          <strong>{formatDate(order.createdAt)}</strong>
        </div>
        <div>
          <p>TOTAL</p>
          <strong>{formatPrice(order.total)}</strong>
        </div>
        <div>
          <p>ID DEL PEDIDO</p>
          <strong>{order.id?.substring(0, 10) || 'N/A'}...</strong>
        </div>
        <div className={orderItemStyles.orderStatus}>
          {order.status.toUpperCase()}
        </div>
      </header>
      <div className={orderItemStyles.orderBody}>
        {order.items.map(item => (
          <div key={item.id} className={orderItemStyles.orderItem}>
            <div className={orderItemStyles.itemImage}>
              <img src={item.imageUrl} alt={item.name} />
            </div>
            <div className={orderItemStyles.itemDetails}>
              <p className={orderItemStyles.itemName}>{item.name}</p>
              <p className={orderItemStyles.itemQty}>Qty: {item.quantity}</p>
            </div>
            <p className={orderItemStyles.itemPrice}>
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};