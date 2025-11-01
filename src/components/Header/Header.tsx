import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiHeart } from 'react-icons/fi';
import styles from './Header.module.css';

import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/Wishlist/WishlistContext';
import { useAuth } from '../../context/AuthContext'; 

const Header: React.FC = () => {
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { currentUser, loading } = useAuth(); 

  const renderAuthLinks = () => {
    if (loading) {
      return null;
    }

    if (currentUser) {
      return (
        <div className={styles.navIcons}>
          <Link to="/wishlist" className={styles.iconButton}>
            <FiHeart />
            {wishlistCount > 0 && (
              <span className={styles.cartBadge}>{wishlistCount}</span>
            )}
          </Link>
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
      );
    }

    return (
      <div className={styles.authLinks}>
        <Link to="/login" className={styles.loginLink}>
          Iniciar Sesión
        </Link>
        <Link to="/register" className={styles.registerLink}>
          Crear Cuenta
        </Link>
      </div>
    );
  };

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
          
          {/* --- ¡LOGO ACTUALIZADO! --- */}
          {/* Reemplazamos el texto "SeoulStash" por tu logo */}
          <Link to="/" className={styles.logo}>
            {/* El navegador buscará en 'public/logo.png' */}
            <img src="/logo.png" alt="SeoulStash Logo" className={styles.logoImage} />
          </Link>

          <div className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input type="text" placeholder="Busca productos, marcas, álbumes..." />
          </div>

          {renderAuthLinks()}

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