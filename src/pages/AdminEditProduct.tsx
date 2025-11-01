import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AdminPage.module.css'; 

import { getProductById, updateProductInFirestore } from '../services/api';
// 1. ¡ARREGLO! 'Product' (el tipo) fue eliminado de esta línea
// porque no se usaba.
import type { } from '../types'; 

const AdminEditProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  // Estados del formulario
  const [name, setName] = useState('');
  const [category, setCategory] = useState('K-Pop');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(4.5);
  const [reviews, setReviews] = useState(0);
  const [tags, setTags] = useState(''); 
  
  const [status, setStatus] = useState<{ type: 'success' | 'error' | '', msg: string }>({ type: '', msg: '' });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (!productId) {
      setStatus({ type: 'error', msg: 'No se encontró ID de producto.' });
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const product = await getProductById(productId);
        
        setName(product.name);
        setCategory(product.category);
        setPrice(product.price);
        setOriginalPrice(product.originalPrice || 0);
        setImageUrl(product.imageUrl);
        setRating(product.rating);
        setReviews(product.reviews);
        setTags(product.tags.join(', ')); 
        
        setLoading(false);
      } catch (err) {
        setStatus({ type: 'error', msg: 'Error al cargar el producto.' });
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return; 

    setLoading(true);
    setStatus({ type: '', msg: '' });

    const productData = {
      name,
      category,
      price: parseFloat(String(price)),
      originalPrice: parseFloat(String(originalPrice)),
      imageUrl,
      rating: parseFloat(String(rating)),
      reviews: parseInt(String(reviews)),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    try {
      await updateProductInFirestore(productId, productData);
      
      setLoading(false);
      setStatus({ type: 'success', msg: '¡Producto actualizado con éxito!' });
      
      setTimeout(() => {
        navigate('/admin/manage-products');
      }, 1500); 

    } catch (error) {
      console.error(error);
      setLoading(false);
      setStatus({ type: 'error', msg: 'Error al actualizar el producto.' });
    }
  };

  if (loading && !name) {
    return <div className={`container ${styles.page}`}><h1 className={styles.title}>Cargando producto...</h1></div>;
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Editar Producto</h1>
      
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nombre del Producto</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="category">Categoría</label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="K-Beauty">K-Beauty</option>
                <option value="K-Pop">K-Pop</option>
                <option value="K-Fashion">K-Fashion</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="imageUrl">URL de la Imagen</label>
              <input type="text" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
            </div>
          </div>

          {/* ... (resto de los campos del formulario) ... */}
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="price">Precio (ej. 24.99)</label>
              <input type="number" step="0.01" id="price" value={price} onChange={e => setPrice(Number(e.target.value))} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="originalPrice">Precio Original (Opcional)</label>
              <input type="number" step="0.01" id="originalPrice" value={originalPrice} onChange={e => setOriginalPrice(Number(e.target.value))} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="rating">Rating (ej. 4.8)</label>
              <input type="number" step="0.1" id="rating" value={rating} onChange={e => setRating(Number(e.target.value))} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="reviews">Reviews (ej. 9541)</label>
              <input type="number" id="reviews" value={reviews} onChange={e => setReviews(Number(e.target.value))} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="tags">Tags (separados por coma, ej. Best Seller, New)</label>
            <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} />
          </div>
          

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Producto'}
          </button>
          
          {status.msg && (
            <p className={`${styles.statusMessage} ${status.type === 'success' ? styles.success : styles.error}`}>
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;