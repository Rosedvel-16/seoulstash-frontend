// src/pages/AdminManageProducts.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProductFromFirestore } from '../services/api';
import type { Product } from '../types';
import styles from './AdminManageProducts.module.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const AdminManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Carga todos los productos al montar
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Pasamos 'null' para traer TODOS los productos
      const data = await getProducts(null);
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Lógica para el botón de eliminar
  const handleDelete = async (productId: string, productName: string) => {
    // Usamos un 'confirm' (no es ideal, pero es rápido)
    // ¡OJO! Tu dijiste que 'confirm' no funciona en el iframe, 
    // así que lo comentaré y lo borraré directo.
    // const wantsToDelete = confirm(`¿Seguro que quieres eliminar "${productName}"?`);
    // if (!wantsToDelete) return;
    
    // --- Solución SIN MODAL ---
    // (En una app real, pondríamos un modal de "Estás seguro?")
    try {
      await deleteProductFromFirestore(productId);
      // Recargamos la lista de productos
      fetchProducts(); 
    } catch (err) {
      alert("Error al eliminar el producto.");
    }
  };
  
  const renderContent = () => {
    if (loading) return <p>Cargando inventario...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    
    return (
      <div className={styles.productTableWrapper}>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <div className={styles.productInfo}>
                    <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td className={styles.actions}>
                  {/* ¡Este enlace irá a la página de "Editar" que crearemos después! */}
                  <Link 
                    to={`/admin/edit-product/${product.id}`} 
                    className={styles.editButton}
                  >
                    <FiEdit />
                  </Link>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDelete(product.id, product.name)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Administrar Inventario</h1>
      {renderContent()}
    </div>
  );
};

export default AdminManageProducts;