import React, { useState } from 'react'; // 1. ¡Importamos useState!
// 2. ¡Importamos useNavigate para redirigir!
import { Link, NavLink, useNavigate } from 'react-router-dom'; 
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMoon, FiSun } from 'react-icons/fi';
import styles from './Header.module.css';

import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/Wishlist/WishlistContext';
import { useAuth } from '../../context/AuthContext'; 
import { useTheme } from '../../context/ThemeContext'; 

const Header: React.FC = () => {
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { currentUser, loading } = useAuth(); 
  const { theme, toggleTheme } = useTheme(); 
  
  // 3. ¡Nuevo estado para guardar lo que el usuario escribe!
  const [searchTerm, setSearchTerm] = useState('');
  // 4. Hook para navegar
  const navigate = useNavigate();

  // 5. Función que se llama al presionar "Enter"
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    if (searchTerm.trim() === '') {
      return; // No busques si está vacío
    }
    // ¡Navega a la página de búsqueda con el query!
    navigate(`/search?q=${searchTerm}`);
  };

  const renderAuthLinks = () => {
    if (loading) return null;
    if (currentUser) {
      return (
        <div className={styles.navIcons}>
          <Link to="/wishlist" className={styles.iconButton}><FiHeart />{wishlistCount > 0 && (<span className={styles.cartBadge}>{wishlistCount}</span>)}</Link>
          <Link to="/cart" className={styles.iconButton}><FiShoppingCart />{cartItemCount > 0 && (<span className={styles.cartBadge}>{cartItemCount}</span>)}</Link>
          <Link to="/profile" className={styles.iconButton}><FiUser /></Link>
        </div>
      );
    }
    return (
      <div className={styles.authLinks}>
        <Link to="/login" className={styles.loginLink}>Iniciar Sesión</Link>
        <Link to="/register" className={styles.registerLink}>Crear Cuenta</Link>
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
          
          <Link to="/" className={styles.logo}>
            <img src="/logo.png" alt="SeoulStash Logo" className={styles.logoImage} />
          </Link>

          {/* 6. ¡Convertimos esto en un formulario! */}
          <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Busca productos, marcas, álbumes..."
              value={searchTerm} // Controlado por el estado
              onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado
            />
          </form>

          <div className={styles.rightNavWrapper}>
            <button 
              className={styles.themeToggleButton} 
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            >
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
            {renderAuthLinks()}
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