// src/components/CartItemCard/CartItemCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { CartItem } from '../../types';
import { useCart } from '../../context/CartContext'; // Importamos el carrito
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import styles from './CartItemCard.module.css';

interface CartItemCardProps {
  item: CartItem;
}

// Función para formatear precios (la moveremos a utils/ luego)
const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  // Obtenemos las funciones para modificar el carrito
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    // La lógica en nuestro reducer ya maneja el "eliminar si es 0"
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className={styles.cartItem}>
      {/* Columna 1: Imagen */}
      <Link to={`/product/${item.id}`} className={styles.itemImageLink}>
        <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
      </Link>

      {/* Columna 2: Detalles del Producto */}
      <div className={styles.itemDetails}>
        <span className={styles.itemCategory}>{item.category}</span>
        <Link to={`/product/${item.id}`} className={styles.itemName}>
          {item.name}
        </Link>
        <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
      </div>

      {/* Columna 3: Selector de Cantidad */}
      <div className={styles.quantitySelector}>
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          aria-label="Restar uno"
        >
          <FiMinus />
        </button>
        <span className={styles.quantityDisplay}>{item.quantity}</span>
        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          aria-label="Sumar uno"
        >
          <FiPlus />
        </button>
      </div>

      {/* Columna 4: Precio Total del Item */}
      <div className={styles.itemTotalPrice}>
        {formatPrice(item.price * item.quantity)}
      </div>

      {/* Columna 5: Botón de Eliminar */}
      <div className={styles.itemActions}>
        <button onClick={handleRemove} aria-label="Eliminar producto">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;