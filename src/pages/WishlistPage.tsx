// src/pages/WishlistPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

// 1. Importamos el hook de la Wishlist y el ProductCard
import { useWishlist } from '../context/Wishlist/WishlistContext'; 
import ProductCard from '../components/ProductCard/ProductCard';
import styles from './WishlistPage.module.css';

const WishlistPage: React.FC = () => {
  // 2. Leemos la wishlist del contexto
  const { wishlist, itemCount } = useWishlist();

  const renderContent = () => {
    // 3. Mostramos el estado vacío
    if (itemCount === 0) {
      return (
        <div className={styles.emptyWishlist}>
          <h2>Tu lista de deseos está vacía</h2>
          <p>Guarda tus productos favoritos haciendo clic en el corazón.</p>
          <Link to="/" className={styles.ctaButton}>
            Explorar Productos
          </Link>
        </div>
      );
    }

    // 4. Mostramos los productos en una cuadrícula
    return (
      <div className={styles.productGrid}>
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.pageTitle}>Mi Lista de Deseos ({itemCount})</h1>
      {renderContent()}
    </div>
  );
};

export default WishlistPage;