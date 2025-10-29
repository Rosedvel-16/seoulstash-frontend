// src/pages/HomePage.tsx (Actualizado)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. Importamos la API y los Tipos
// ¡Añadimos getFeaturedProducts y el tipo Product!
import { getCategories, getFeaturedProducts } from '../services/api';
import type { Category, Product } from '../types';

// 2. Importamos los nuevos componentes y estilos
import CategoryCard from '../components/CategoryCard/CategoryCard';
import ProductCard from '../components/ProductCard/ProductCard'; // ¡Nuevo!
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  // --- Estado para Categorías ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // --- Estado para Productos Destacados (¡Nuevo!) ---
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // 4. useEffect para cargar CATEGORÍAS
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setCategoriesError('Error al cargar las categorías.');
        console.error(err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // 5. useEffect para cargar PRODUCTOS DESTACADOS (¡Nuevo!)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setProductsError(null);

        // ¡Llamamos a la nueva función de la API!
        const data = await getFeaturedProducts();

        setFeaturedProducts(data); // Guardamos los productos
      } catch (err) {
        setProductsError('Error al cargar los productos destacados.');
        console.error(err);
      } finally {
        setIsLoadingProducts(false); // Terminamos de cargar
      }
    };

    fetchProducts();
  }, []); // El array vacío [] significa "ejecutar esto solo una vez"

  // --- Funciones de Renderizado ---

  const renderCategories = () => {
    if (isLoadingCategories) {
      return <p className={styles.loadingText}>Cargando categorías...</p>;
    }
    if (categoriesError) {
      return <p style={{ color: 'red' }}>{categoriesError}</p>;
    }
    return (
      <div className={styles.categoryGrid}>
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    );
  };

  // ¡Nueva función para renderizar productos!
  const renderFeaturedProducts = () => {
    if (isLoadingProducts) {
      return <p className={styles.loadingText}>Cargando productos destacados...</p>;
    }
    if (productsError) {
      return <p style={{ color: 'red' }}>{productsError}</p>;
    }
    return (
      <div className={styles.productGrid}>
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.homePage}>
      {/* SECCIÓN 1: HERO (BANNER) */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
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

      {/* SECCIÓN 2: EXPLORA POR CATEGORÍA */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Explora por Categoría</h2>
        <p className={styles.sectionSubtitle}>Encuentra exactamente lo que buscas</p>
        {renderCategories()}
      </section>

      {/* SECCIÓN 3: PRODUCTOS DESTACADOS (¡Nueva!) */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Productos Destacados</h2>
        <p className={styles.sectionSubtitle}>Los más vendidos y mejor calificados</p>
        {renderFeaturedProducts()}
      </section>
    </div>
  );
};

export default HomePage;