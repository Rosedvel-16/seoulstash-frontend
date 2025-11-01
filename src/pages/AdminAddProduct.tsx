import React, { useState } from 'react';
import styles from './AdminPage.module.css';

// 1. ¡Importamos nuestra nueva función de la API!
import { addProductToFirestore } from '../services/api';

const AdminAddProduct: React.FC = () => {
  // Estados del formulario (sin cambios)
  const [name, setName] = useState('');
  const [category, setCategory] = useState('K-Pop'); // <-- Pongo K-Pop por defecto
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(4.5);
  const [reviews, setReviews] = useState(0);
  const [tags, setTags] = useState(''); 
  
  const [status, setStatus] = useState<{ type: 'success' | 'error' | '', msg: string }>({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  // --- ¡handleSubmit ACTUALIZADO! ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    // 2. Convertir los datos (sin cambios)
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
      // 3. ¡Llamada REAL a la API!
      // (Quitamos la simulación y el console.log)
      const newProductId = await addProductToFirestore(productData);
      
      setLoading(false);
      setStatus({ type: 'success', msg: `¡Producto añadido con éxito! ID: ${newProductId}` });
      
      // 4. Limpiamos el formulario
      setName('');
      setPrice(0);
      setOriginalPrice(0);
      setImageUrl('');
      setRating(4.5);
      setReviews(0);
      setTags('');

    } catch (error) {
      // 5. Manejo de error REAL
      console.error(error);
      setLoading(false);
      setStatus({ type: 'error', msg: 'Error al añadir el producto. Revisa la consola.' });
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Panel de Admin: Añadir Producto</h1>
      
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
            {loading ? 'Añadiendo...' : 'Añadir Producto'}
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

export default AdminAddProduct;