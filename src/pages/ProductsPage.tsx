import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// 1. Importamos la nueva función de API (que AÚN NO HEMOS CREADO)
// y los nuevos tipos
import { getProducts, getFiltersForCategory } from '../services/api';
import type { Product, Filter, SelectedFilters } from '../types'; // <-- Añadido SelectedFilters
import ProductCard from '../components/ProductCard/ProductCard';
import Sidebar from '../components/Sidebar/Sidebar';
import styles from './ProductsPage.module.css';

// Función helper (sin cambios)
const formatCategoryName = (id: string): string => {
  if (!id) return '';
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-'); 
};

const ProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Estados (sin cambios)
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  
  // 2. ¡NUEVO ESTADO! Aquí guardamos los filtros que el Sidebar nos envía
  const [activeFilters, setActiveFilters] = useState<SelectedFilters>({});

  // 3. useEffect para cargar FILTROS (cuando cambia la categoría)
  useEffect(() => {
    const fetchFilters = async () => {
      if (!categoryId) return; 

      try {
        const formattedName = formatCategoryName(categoryId);
        const filtersData = await getFiltersForCategory(formattedName);
        setFilters(filtersData);
        // ¡Importante! Reseteamos los filtros activos si cambia la categoría
        setActiveFilters({});
        
      } catch (err) {
        console.error("Error al cargar filtros: ", err);
        // No ponemos un error de página completa, solo fallan los filtros
      }
    };

    fetchFilters();
  }, [categoryId]); // Depende SOLO de categoryId

  // 4. useEffect para cargar PRODUCTOS (cuando cambia la categoría O los filtros)
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return; 

      try {
        setIsLoading(true);
        setError(null);
        
        const formattedName = formatCategoryName(categoryId);
        setPageTitle(formattedName.replace('-', ' ')); 
        
        // ¡LLAMADA A LA API ACTUALIZADA!
        // Ahora le pasamos la categoría Y los filtros activos
        const productsData = await getProducts(formattedName, activeFilters);
        
        setProducts(productsData);

      } catch (err) {
        setError('Error al cargar los productos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, activeFilters]); // <-- ¡DEPENDE DE AMBOS!

  
  // 5. Función que le pasaremos al Sidebar
  const handleApplyFilters = (selectedFilters: SelectedFilters) => {
    // Cuando el Sidebar nos "devuelve" los filtros,
    // los guardamos en nuestro estado.
    // Esto disparará el useEffect de [activeFilters] (arriba)
    console.log("Página recibió filtros:", selectedFilters);
    setActiveFilters(selectedFilters);
  };
  
  // Renderizado de productos (sin cambios)
  const renderProducts = () => {
    if (products.length === 0) {
      return <p className={styles.loadingText}>No se encontraron productos con estos filtros.</p>;
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
        {!isLoading && (
          <p className={styles.productCount}>
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        )}
      </header>

      <div className={styles.contentGrid}>
        
        {/* 6. ¡ARREGLADO! Pasamos la nueva prop 'onApplyFilters' */}
        <Sidebar 
          filters={filters} 
          onApplyFilters={handleApplyFilters} 
        />

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