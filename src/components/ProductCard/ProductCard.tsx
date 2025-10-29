// src/components/ProductCard/ProductCard.tsx (CORREGIDO)
import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import Rating from '../Rating/Rating';

// 1. ¡Importamos el ícono de corazón relleno de 'ai' (Ant Design)!
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai'; 

import styles from './ProductCard.module.css';

// 2. Importamos ambos hooks (con las rutas corregidas)
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/Wishlist/WishlistContext'; 

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  // 3. Obtenemos las funciones de la wishlist
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isWished = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
  };
  
  // 4. Lógica de Wishlist CORREGIDA
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWished) {
      removeFromWishlist(product.id);
    } else {
      // ¡CORREGIDO! Pasamos el objeto 'product' completo
      addToWishlist(product); 
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
        
        <div className={styles.quickActions}>
          <button 
            className={`${styles.actionButton} ${isWished ? styles.wished : ''}`} 
            aria-label="Añadir a wishlist"
            onClick={handleWishlistClick}
          >
            {/* Usamos el ícono 'AiFillHeart' (corregido) */}
            {isWished ? <AiFillHeart /> : <FiHeart />}
          </button>
          
          <button 
            className={styles.actionButton} 
            aria-label="Añadir al carrito"
            onClick={handleAddToCartClick}
          >
            <FiShoppingCart />
          </button>
        </div>
        
        <div className={styles.tags}>
          {product.tags.map(tag => (
            <span key={tag} className={`${styles.tag} ${styles[tag.toLowerCase().replace(/[^a-z0-9]/g, '')]}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.cardContent}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/product/${product.id}`} className={styles.productName}>
          {product.name}
        </Link>
        
        <Rating rating={product.rating} reviews={product.reviews} />

        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;