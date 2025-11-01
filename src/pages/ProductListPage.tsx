// src/pages/ProductListPage.tsx
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard/ProductCard';
import styles from './ProductsPage.module.css'; // Reutilizamos los estilos

// Esta página recibe sus props (título y la función que busca productos)
interface ProductListPageProps {
  title: string;
  fetchProducts: () => Promise<Product[]>;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ title, fetchProducts }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Llama a la función específica que le pasamos
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Error al cargar productos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    // Se recarga si la función (o el título) cambian
  }, [fetchProducts, title]);

  const renderContent = () => {
    if (isLoading) {
      return <p className={styles.loadingText}>Cargando productos...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    if (products.length === 0) {
      return <p className={styles.loadingText}>No se encontraron productos.</p>;
    }
    return (
      // Reutilizamos el grid de 4 columnas de la home
      <div className={styles.productGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <div className={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProductListPage;