import React, { useState } from 'react'; // 1. Importa useState
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaCcVisa, FaCcMastercard, FaPaypal } from 'react-icons/fa6';
import styles from './Footer.module.css';

// 2. ¡Importa el hook de autenticación!
import { useAuth } from '../../context/AuthContext';

const Footer: React.FC = () => {
  // 3. Obtenemos el estado del usuario
  const { currentUser, loading } = useAuth();
  
  // 4. Estado para el formulario (para usuarios logueados)
  const [email, setEmail] = useState(currentUser?.email || '');
  const [message, setMessage] = useState('');

  // 5. Simulación de suscripción para usuarios logueados
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(`¡Gracias por suscribirte, ${currentUser?.displayName || 'Fan'}! (Simulación)`);
    setEmail('');
    setTimeout(() => setMessage(''), 3000); // Borra el mensaje después de 3 seg
  };

  // 6. ¡NUEVA FUNCIÓN! Renderiza la sección dinámicamente
  const renderNewsletterSection = () => {
    // No mostramos nada mientras se comprueba el usuario
    if (loading) {
      return null;
    }

    // --- A. Si el usuario NO ha iniciado sesión ---
    if (!currentUser) {
      return (
        <div className={`container ${styles.newsletterContainer}`}>
          <h3>Únete a nuestra comunidad</h3>
          <p>Crea una cuenta para guardar tu wishlist, ver tus pedidos y pagar más rápido.</p>
          {/* ¡El botón que pediste! */}
          <Link to="/register" className={styles.subscribeButton_Cta}>
            Crear Cuenta
          </Link>
        </div>
      );
    }
    
    // --- B. Si el usuario SÍ ha iniciado sesión ---
    return (
      <div className={`container ${styles.newsletterContainer}`}>
        <h3>¡Mantente conectado!</h3>
        <p>Recibe las últimas novedades de K-Pop y ofertas exclusivas en tu correo.</p>
        <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
          <input 
            type="email" 
            placeholder="Tu correo electrónico"
            value={email} // Rellenado automático si ya lo tenemos
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Suscribirse</button>
        </form>
        {message && <p className={styles.statusMessage_success}>{message}</p>}
      </div>
    );
  };

  return (
    <footer className={styles.footer}>
      {/* 7. Llamamos a la nueva función de renderizado */}
      <div className={styles.newsletterSection}>
        {renderNewsletterSection()}
      </div>
  
      {/* (El resto del footer no cambia) */}
      <div className={styles.mainFooter}>
        <div className={`container ${styles.mainFooterContainer}`}>
          
          <div className={styles.footerColumn}>
            <h4 className={styles.logo}>SeoulStash</h4>
            <p>Tu destino #1 para productos auténticos de la cultura coreana.</p>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h4>Comprar</h4>
            <Link to="/products/k-beauty">K-Beauty</Link>
            <Link to="/products/k-pop">K-Pop</Link>
            <Link to="/products/k-fashion">K-Fashion</Link>
            <Link to="/products/snacks">Snacks Coreanos</Link>
            <Link to="/new">Nuevos Lanzamientos</Link>
            <Link to="/offers">Ofertas</Link>
          </div>

          <div className={styles.footerColumn}>
            <h4>Atención al Cliente</h4>
            <Link to="/contact">Contacto</Link>
            <Link to="/shipping">Envíos y Entregas</Link>
            <Link to="/returns">Devoluciones</Link>
            <Link to="/faq">Preguntas Frecuentes</Link>
            <Link to="/tracking">Rastrear Pedido</Link>
            <Link to="/authenticity">Garantía de Autenticidad</Link>
          </div>

          <div className={styles.footerColumn}>
            <h4>Empresa</h4>
            <Link to="/about">Sobre Nosotros</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/careers">Carreras</Link>
            <Link to="/affiliates">Programa de Afiliados</Link>
            <Link to="/terms">Términos y Condiciones</Link>
            <Link to="/privacy">Política de Privacidad</Link>
          </div>
    
        </div>
      </div>
    
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomBarContainer}`}>
          <p>© {new Date().getFullYear()} SeoulStash. Todos los derechos reservados.</p>
          <div className={styles.paymentIcons}>
            <FaCcVisa />
            <FaCcMastercard />
            <FaPaypal />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
