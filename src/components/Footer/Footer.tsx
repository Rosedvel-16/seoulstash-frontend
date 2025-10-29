// src/components/Footer/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
// Iconos de redes sociales y de pago
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaCcVisa, FaCcMastercard, FaPaypal } from 'react-icons/fa6';
// Importamos los estilos
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      {/* 1. SECCIÓN DE SUSCRIPCIÓN */}
      <div className={styles.newsletterSection}>
        <div className={`container ${styles.newsletterContainer}`}>
          <h3>Únete a nuestra comunidad</h3>
          <p>Recibe las últimas novedades de K-Pop, ofertas exclusivas y lanzamientos.</p>
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Tu correo electrónico" />
            <button type="submit">Suscribirse</button>
          </form>
        </div>
      </div>

      {/* 2. SECCIÓN PRINCIPAL DE ENLACES */}
      <div className={styles.mainFooter}>
        <div className={`container ${styles.mainFooterContainer}`}>

          {/* Columna 1: Sobre "SeoulStash" */}
          <div className={styles.footerColumn}>
            <h4 className={styles.logo}>SeoulStash</h4>
            <p>Tu destino #1 para productos auténticos de la cultura coreana. Desde K-Beauty hasta K-Pop, traemos lo mejor de Corea directo a tu puerta.</p>
            <div className={styles.socialIcons}>
              <a href="https://www.facebook.com/rosedvel/?locale=es_LA" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://x.com/Runsedvel" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://www.instagram.com/rosedvel" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://www.youtube.com/@abybybyd1" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          {/* Columna 2: Comprar */}
          <div className={styles.footerColumn}>
            <h4>Comprar</h4>
            <Link to="/products/k-beauty">K-Beauty</Link>
            <Link to="/products/k-pop">K-Pop</Link>
            <Link to="/products/k-fashion">K-Fashion</Link>
            <Link to="/products/snacks">Snacks Coreanos</Link>
            <Link to="/new">Nuevos Lanzamientos</Link>
            <Link to="/offers">Ofertas</Link>
          </div>

          {/* Columna 3: Atención al Cliente */}
          <div className={styles.footerColumn}>
            <h4>Atención al Cliente</h4>
            <Link to="/contact">Contacto</Link>
            <Link to="/shipping">Envíos y Entregas</Link>
            <Link to="/returns">Devoluciones</Link>
            <Link to="/faq">Preguntas Frecuentes</Link>
            <Link to="/tracking">Rastrear Pedido</Link>
            <Link to="/authenticity">Garantía de Autenticidad</Link>
          </div>

          {/* Columna 4: Empresa */}
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

      {/* 3. BARRA INFERIOR (COPYRIGHT Y PAGOS) */}
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