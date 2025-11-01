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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(null);
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  };

  // 1. ¡ARREGLO! 'productName' eliminado de los parámetros
  const handleDelete = async (productId: string) => {
    
    // Como 'confirm()' no funciona, borramos directo.
    // En una app real, aquí abriríamos un modal de confirmación.
    try {
      await deleteProductFromFirestore(productId);
      fetchProducts(); 
    } catch (err) {
      // Como 'alert()' tampoco funciona, lo mandamos a la consola
      console.error("Error al eliminar el producto.", err);
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
                  <Link 
                    to={`/admin/edit-product/${product.id}`} 
                    className={styles.editButton}
                  >
                    <FiEdit />
                  </Link>
                  <button 
                    className={styles.deleteButton}
                    // 2. ¡ARREGLO! 'product.name' eliminado de la llamada
                    onClick={() => handleDelete(product.id)}
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