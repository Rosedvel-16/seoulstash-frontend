// src/components/HeroSlider/HeroSlider.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSlider.module.css';

// Las 4 imágenes que nos diste
const images = [
  'https://s1.abcstatics.com/abc/www/multimedia/viajar/2022/07/17/SeulbarriodeHongdae-RMxPrv6MqCFrp89LS8ZbEnJ-1240x768@abc.jpg',
  'https://www.agoda.com/wp-content/uploads/2024/08/Namsan-Tower-during-autumn-in-Seoul-South-Korea-1244x700.jpg',
  'https://touristforum-pro-backend-public20250204102506622000000003.s3.eu-west-1.amazonaws.com/south_korea_lake_e57fe5043c.jpg',
  'https://content.r9cdn.net/rimg/dimg/c1/f7/06109851-ctry-132-171a795fe02.jpg?width=1366&height=768&xhint=3330&yhint=2439&crop=true'
];

const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lógica para el carrusel
  useEffect(() => {
    // Cambia de imagen cada 5 segundos
    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
    }, 5000); // 5000ms = 5 segundos

    // Limpia el timer si el componente se desmonta
    return () => clearTimeout(timer);
  }, [currentIndex]); // Se reinicia cada vez que 'currentIndex' cambia

  return (
    <section className={styles.heroSection}>
      {/* Contenedor de las imágenes */}
      <div className={styles.slider}>
        {images.map((imgUrl, index) => (
          <div 
            key={imgUrl}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
            style={{ backgroundImage: `url(${imgUrl})` }}
          ></div>
        ))}
      </div>

      {/* Capa oscura para que el texto resalte */}
      <div className={styles.overlay}></div>

      {/* Contenido (el mismo de antes) */}
      <div className={`container ${styles.heroContent}`}>
        <span className={styles.heroTag}>Tu Hub Centralizado para la Cultura Coreana</span>
        <h1 className={styles.heroTitle}>Descubre lo Mejor de Corea</h1>
        <p className={styles.heroSubtitle}>
          Desde K-Beauty hasta K-Pop, trae la auténtica experiencia coreana a tu hogar.
          Productos oficiales, envíos rápidos y garantía de autenticidad.
        </p>
        <div className={styles.heroActions}>
          <Link to="/products/k-beauty" className={styles.ctaButton}>
            Explorar Productos
          </Link>
          <Link to="/new" className={styles.secondaryButton}>
            Ver Nuevos Lanzamientos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;