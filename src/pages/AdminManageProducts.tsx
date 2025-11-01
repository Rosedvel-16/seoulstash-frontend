import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProductFromFirestore } from '../services/api';
import type { Product } from '../types';
import styles from './AdminManageProducts.module.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

// 1. ¡Importamos los hooks del carrito y la wishlist!
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/Wishlist/WishlistContext'; // (Usa tu ruta correcta)

const AdminManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Obtenemos las funciones para eliminar
  const { removeFromCart } = useCart();
  const { removeFromWishlist } = useWishlist();

  // (useEffect y fetchProducts no cambian)
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

  // 3. ¡Función 'handleDelete' ACTUALIZADA!
  const handleDelete = async (productId: string) => {
    try {
      // 1. Borra de Firebase (como antes)
      await deleteProductFromFirestore(productId);
      
      // 2. ¡NUEVO! Borra del carrito local
      removeFromCart(productId);
      
      // 3. ¡NUEVO! Borra de la wishlist local
      removeFromWishlist(productId);

      // 4. Recarga la lista de productos de la tabla
      fetchProducts(); 
      
    } catch (err) {
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