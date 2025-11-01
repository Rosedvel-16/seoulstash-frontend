import React, { useState, useEffect } from 'react';
// 1. Quitamos 'Link' porque ya no está en el Hero (está dentro del Slider)
import { getCategories, getFeaturedProducts } from '../services/api';
import type { Category, Product } from '../types';
import CategoryCard from '../components/CategoryCard/CategoryCard';
import ProductCard from '../components/ProductCard/ProductCard';

// 2. ¡Importamos el nuevo HeroSlider!
import HeroSlider from '../components/HeroSlider/HeroSlider';
// 3. Importamos los estilos solo para las secciones (el Hero ya no lo usa)
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  // --- Estados (sin cambios) ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // --- useEffects (sin cambios) ---
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setProductsError(null);
        const data = await getFeaturedProducts();
        setFeaturedProducts(data);
      } catch (err) {
        setProductsError('Error al cargar los productos destacados.');
        console.error(err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Funciones de Renderizado (sin cambios) ---
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
      {/* 4. ¡SECCIÓN 1 REEMPLAZADA! */}
      {/* Ya no usamos el 'heroSection' de HomePage.module.css */}
      <HeroSlider />

      {/* SECCIÓN 2: EXPLORA POR CATEGORÍA */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Explora por Categoría</h2>
        <p className={styles.sectionSubtitle}>Encuentra exactamente lo que buscas</p>
        {renderCategories()}
      </section>

      {/* SECCIÓN 3: PRODUCTOS DESTACADOS */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Productos Destacados</h2>
        <p className={styles.sectionSubtitle}>Los más vendidos y mejor calificados</p>
        {renderFeaturedProducts()}
      </section>
    </div>
  );
};

export default HomePage;