// src/pages/OrderSuccessPage.tsx
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './OrderSuccessPage.module.css';
import { FiCheckCircle } from 'react-icons/fi'; // Icono de "éxito"

const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className={`container ${styles.page}`}>
      
      <div className={styles.iconWrapper}>
        <FiCheckCircle />
      </div>
      
      <h1 className={styles.title}>¡Gracias por tu compra!</h1>
      <p className={styles.subtitle}>Tu pedido ha sido procesado exitosamente.</p>
      
      {orderId && (
        <p className={styles.orderInfo}>
          Tu ID de pedido es: <strong>{orderId}</strong>
        </p>
      )}

      <div className={styles.actions}>
        <Link to="/" className={styles.button}>
          Seguir Comprando
        </Link>
        <Link to="/profile/orders" className={styles.buttonSecondary}>
          Ver Mis Pedidos
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccessPage;