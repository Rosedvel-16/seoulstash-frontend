// src/components/Header/Header.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiHeart } from 'react-icons/fi';
import styles from './Header.module.css';

// 1. ¡Importamos los hooks con las NUEVAS RUTAS!
import { useCart } from '../../context/CartContext'; 
import { useWishlist } from '../../context/Wishlist/WishlistContext'; 

const Header: React.FC = () => {
  // 2. Obtenemos ambos contadores
  const { itemCount: cartItemCount } = useCart(); // Renombramos para claridad
  const { itemCount: wishlistCount } = useWishlist(); // Renombramos para claridad

  return (
    <header className={styles.headerWrapper}>
      
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarContainer}`}>
          <span>¡Envío gratis en compras mayores a $50!</span>
          <span>Nuevos álbumes de K-Pop disponibles</span>
        </div>
      </div>

      <nav className={styles.mainNav}>
        <div className={`container ${styles.mainNavContainer}`}>
          
          <Link to="/" className={styles.logo}>SeoulStash</Link>

          <div className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input type="text" placeholder="Busca productos, marcas, álbumes..." />
          </div>

          <div className={styles.navIcons}>
            {/* 3. Link de la Wishlist (ahora con badge) */}
            <Link to="/wishlist" className={styles.iconButton}>
              <FiHeart />
              {wishlistCount > 0 && (
                <span className={styles.cartBadge}>{wishlistCount}</span>
              )}
            </Link>
            
            {/* Link del Carrito */}
            <Link to="/cart" className={styles.iconButton}>
              <FiShoppingCart />
              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </Link>
            
            <Link to="/profile" className={styles.iconButton}>
              <FiUser />
            </Link>
          </div>

        </div>
      </nav>

      <div className={styles.categoriesNav}>
        <div className={`container ${styles.categoriesContainer}`}>
          <NavLink to="/" end>Todo</NavLink>
          <NavLink to="/products/k-beauty">K-Beauty</NavLink>
          <NavLink to="/products/k-pop">K-Pop</NavLink>
          <NavLink to="/products/k-fashion">K-Fashion</NavLink>
          <NavLink to="/products/snacks">Snacks</NavLink>
          <NavLink to="/offers">Ofertas</NavLink>
          <NavLink to="/new">Nuevos</NavLink>
        </div>
      </div>

    </header>
  );
};

export default Header;