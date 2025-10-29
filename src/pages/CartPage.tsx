// src/pages/CartPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItemCard from '../components/CartItemCard/CartItemCard';
import styles from './CartPage.module.css'; // Crearemos este archivo ahora

// Función para formatear precios
const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

const CartPage: React.FC = () => {
  const { cart, itemCount, totalPrice, clearCart } = useCart();

  // Variable de ejemplo para el envío
  const shippingCost = itemCount > 0 ? 5.99 : 0;
  const totalWithShipping = totalPrice + shippingCost;
  const freeShippingThreshold = 50;
  const amountForFreeShipping = freeShippingThreshold - totalPrice;

  // Función para renderizar el contenido principal
  const renderCartContent = () => {
    if (itemCount === 0) {
      return (
        <div className={styles.emptyCart}>
          <h2>Tu carrito está vacío</h2>
          <p>Parece que aún no has añadido nada. ¡Explora nuestros productos!</p>
          <Link to="/" className={styles.ctaButton}>
            Seguir Comprando
          </Link>
        </div>
      );
    }

    // Si hay items, mostramos la lista y el resumen
    return (
      <div className={styles.cartGrid}>

        {/* Columna Izquierda: Lista de Items */}
        <div className={styles.cartItemsList}>
          <div className={styles.listHeader}>
            <span>Producto</span>
            <span></span>
            <span>Cantidad</span>
            <span className={styles.rightAlign}>Total</span>
            <span></span>
          </div>
          {cart.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))}
          <button onClick={clearCart} className={styles.clearCartButton}>
            Vaciar Carrito
          </button>
        </div>

        {/* Columna Derecha: Resumen de Pago */}
        <aside className={styles.orderSummary}>
          <h4>Resumen del Pedido</h4>
          <div className={styles.summaryRow}>
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Envío</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>

          {/* Barra de envío gratis */}
          {amountForFreeShipping > 0 ? (
            <div className={styles.freeShippingMessage}>
              <p>Agrega {formatPrice(amountForFreeShipping)} más para envío gratis.</p>
              <div className={styles.shippingProgressBar}>
                <div 
                  className={styles.shippingProgress} 
                  style={{ width: `${(totalPrice / freeShippingThreshold) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className={styles.freeShippingMessage}>
              <p>¡Felicidades! Tienes envío gratis.</p>
            </div>
          )}

          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>{formatPrice(totalWithShipping)}</span>
          </div>
          <button className={styles.ctaButton}>
            Proceder al Pago
          </button>
          <Link to="/" className={styles.continueShopping}>
            Continuar Comprando
          </Link>
        </aside>

      </div>
    );
  };


  return (
    <div className={`container ${styles.cartPage}`}>
      <h1 className={styles.pageTitle}>Carrito de Compras ({itemCount})</h1>
      {renderCartContent()}
    </div>
  );
};

export default CartPage;