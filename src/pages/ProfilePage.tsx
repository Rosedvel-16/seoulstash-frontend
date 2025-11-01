import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import styles from './ProfilePage.module.css'; // 1. Importamos los estilos (que actualizaremos)
import { FiUser, FiHeart, FiPackage, FiLogOut, FiCreditCard, FiShield, FiEdit } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; 

// --- Importaciones para "Mis Pedidos" (sin cambios) ---
import { getOrdersForUser } from '../services/api';
import type { Order } from '../types';
import orderItemStyles from './OrderItem.module.css';

// --- Componente ProfilePage (Casi sin cambios) ---
// (Solo un pequeño cambio en el 'context' del Outlet)
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
          {/* 2. ¡ACTUALIZADO! Pasamos el email al contexto del Outlet */}
          <Outlet context={{ 
            displayName: currentUser.displayName, 
            email: currentUser.email 
          }} /> 
        </main>
      </div>
    </div>
  );
};


// --- ¡COMPONENTE 'ProfileWelcome' ACTUALIZADO! ---
export const ProfileWelcome: React.FC = () => {
  // 3. Leemos ambos valores del contexto del Outlet
  const { displayName, email } = useOutletContext<{ displayName: string | null, email: string | null }>();
  // 4. Importamos las funciones de Auth
  const { resetPassword } = useAuth();
  
  // 5. Estado para los mensajes (ej. "¡Correo enviado!")
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // 6. Handler para cambiar la contraseña
  const handleResetPassword = async () => {
    if (!email) {
      setError('No se pudo encontrar tu correo electrónico.');
      return;
    }
    
    setMessage('');
    setError('');
    
    try {
      await resetPassword(email);
      setMessage('¡Correo de recuperación enviado! Revisa tu bandeja de entrada.');
    } catch (err) {
      setError('Error al enviar el correo. Intenta de nuevo más tarde.');
      console.error(err);
    }
  };
  
  return (
    <div>
      {/* 7. Mostramos el nombre real */}
      <h2>¡Bienvenido, <span>{displayName || 'Fan'}</span>!</h2>
      <p className={styles.welcomeMessage}>
        Desde aquí puedes administrar los detalles de tu cuenta.
      </p>
      
      {/* 8. ¡NUEVA SECCIÓN de Información! */}
      <div className={styles.infoBox}>
        <h4 className={styles.infoTitle}>Información de la Cuenta</h4>
        <div className={styles.infoRow}>
          <span>Nombre de Usuario:</span>
          <strong>{displayName || 'N/A'}</strong>
        </div>
        <div className={styles.infoRow}>
          <span>Correo Afiliado:</span>
          <strong>{email || 'N/A'}</strong>
        </div>
      </div>
      
      {/* 9. ¡NUEVA SECCIÓN de Seguridad! */}
      <div className={styles.infoBox}>
        <h4 className={styles.infoTitle}>Seguridad</h4>
        <div className={styles.infoRow}>
          <span>Contraseña:</span>
          <button 
            className={styles.changePasswordButton} 
            onClick={handleResetPassword}
          >
            Enviar correo de recuperación
          </button>
        </div>
        {/* 10. Mensajes de estado */}
        {message && <p className={styles.statusMessage_success}>{message}</p>}
        {error && <p className={styles.statusMessage_error}>{error}</p>}
      </div>
    </div>
  );
};


// --- Componente 'ProfileOrders' (sin cambios) ---
export const ProfileOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); 

  useEffect(() => {
    if (!currentUser) return; 
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
  }, [currentUser]); 

  if (loading) {
    return <h2>Cargando mis pedidos...</h2>;
  }

  return (
    <div>
      <h2>Mis Pedidos</h2>
      {orders.length === 0 ? (
        <p className={styles.welcomeMessage}>
          Aún no tienes pedidos.
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

// --- Componente helper 'OrderCard' (sin cambios) ---
const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return 'Fecha inválida';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <div className={orderItemStyles.orderCard}>
      <header className={orderItemStyles.orderHeader}>
        <div><p>FECHA DEL PEDIDO</p><strong>{formatDate(order.createdAt)}</strong></div>
        <div><p>TOTAL</p><strong>{formatPrice(order.total)}</strong></div>
        <div><p>ID DEL PEDIDO</p><strong>{order.id?.substring(0, 10) || 'N/A'}...</strong></div>
        <div className={orderItemStyles.orderStatus}>{order.status.toUpperCase()}</div>
      </header>
      <div className={orderItemStyles.orderBody}>
        {order.items.map(item => (
          <div key={item.id} className={orderItemStyles.orderItem}>
            <div className={orderItemStyles.itemImage}><img src={item.imageUrl} alt={item.name} /></div>
            <div className={orderItemStyles.itemDetails}>
              <p className={orderItemStyles.itemName}>{item.name}</p>
              <p className={orderItemStyles.itemQty}>Qty: {item.quantity}</p>
            </div>
            <p className={orderItemStyles.itemPrice}>{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
