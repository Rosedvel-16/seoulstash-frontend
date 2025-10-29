import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// 1. Importamos la nueva función de API y el tipo Filter
import { getProducts, getFiltersForCategory } from '../services/api';
import type { Product, Filter } from '../types'; 
import ProductCard from '../components/ProductCard/ProductCard';
import Sidebar from '../components/Sidebar/Sidebar';
import styles from './ProductsPage.module.css';

// Función helper (sin cambios)
const formatCategoryName = (id: string): string => {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  // 2. Creamos estados separados para Productos y Filtros
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]); // <-- Nuevo estado
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('');

  // 3. useEffect ahora busca AMBAS cosas: productos y filtros
  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return; 

      try {
        setIsLoading(true);
        setError(null);
        
        const formattedName = formatCategoryName(categoryId);
        setPageTitle(formattedName); 
        
        // 4. Usamos Promise.all para buscar ambas cosas al mismo tiempo
        // Esto es más rápido que hacer dos 'await' separados
        const [productsData, filtersData] = await Promise.all([
          getProducts(formattedName),      // Promesa 1: Traer productos
          getFiltersForCategory(formattedName) // Promesa 2: Traer filtros
        ]);
        
        setProducts(productsData);
        setFilters(filtersData); // <-- Guardamos los filtros

      } catch (err) {
        setError('Error al cargar la página de categoría.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]); // Se re-ejecuta si la URL (categoryId) cambia

  
  // Función de renderizado de productos (sin cambios)
  const renderProducts = () => {
    if (products.length === 0) {
      return <p className={styles.loadingText}>No se encontraron productos en esta categoría.</p>;
    }
    return (
      <div className={styles.productGrid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>{pageTitle}</h1>
        {/* Mostramos el conteo solo si no está cargando */}
        {!isLoading && (
          <p className={styles.productCount}>
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        )}
      </header>

      <div className={styles.contentGrid}>
        
        {/* Columna 1: Sidebar 
            5. Pasamos los filtros (vacíos o llenos) al Sidebar.
               Esto arregla el error.
        */}
        <Sidebar filters={filters} />

        <div className={styles.mainContent}>
          {isLoading ? (
            <p className={styles.loadingText}>Cargando productos...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            renderProducts()
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;