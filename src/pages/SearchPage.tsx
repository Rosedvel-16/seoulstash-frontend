// src/pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
// 1. Importamos 'useSearchParams' para leer la URL
import { useSearchParams } from 'react-router-dom';

// 2. Importamos la API (la función 'searchProducts' la crearemos en el prox. paso)
import { searchProducts } from '../services/api';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard/ProductCard';
// 3. Reutilizamos los estilos de la página de productos
import styles from './ProductsPage.module.css'; 

const SearchPage: React.FC = () => {
  // 4. useSearchParams nos permite leer "?q=pepero"
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // 'q' es el término de búsqueda

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. Este useEffect se ejecuta cada vez que el 'query' en la URL cambia
  useEffect(() => {
    // Si no hay query (ej. /search) o es un string vacío, no busques nada
    if (!query) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // 6. ¡Llamamos a la nueva función de API! (Dará error por ahora)
        const data = await searchProducts(query);
        setProducts(data);
      } catch (err) {
        setError('Error al buscar productos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [query]); // Se re-ejecuta si 'query' cambia

  const renderContent = () => {
    if (isLoading) {
      return <p className={styles.loadingText}>Buscando productos...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    if (products.length === 0) {
      return <p className={styles.loadingText}>No se encontraron productos para "{query}"</p>;
    }
    return (
      // Reutilizamos el grid de 4 columnas
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
        <h1 className={styles.title}>Resultados de Búsqueda</h1>
        <p className={styles.productCount}>
          {isLoading ? '...' : products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'} para "{query}"
        </p>
      </header>
      <div className={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
};

export default SearchPage;