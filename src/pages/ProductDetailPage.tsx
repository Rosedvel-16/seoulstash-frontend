// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import Rating from '../components/Rating/Rating'; // Reutilizamos el componente
import { FiPlus, FiMinus } from 'react-icons/fi';
import styles from './ProductDetailPage.module.css';

// Función para formatear precios
const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

const ProductDetailPage: React.FC = () => {
  // 2. Leemos el ':productId' de la URL (ej. "kb1")
  const { productId } = useParams<{ productId: string }>();

  // 3. Importamos el carrito
  const { addToCart, updateQuantity, cart } = useCart();

  // Estado para el producto
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el selector de cantidad
  const [quantity, setQuantity] = useState(1);

  // 4. useEffect para buscar el producto por ID
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('No se especificó un ID de producto.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getProductById(productId);
        // Añadimos una descripción de relleno si no existe
        data.description = data.description || "Descripción de relleno para este producto increíble. Compra ahora, ¡no te arrepentirás! Perfecto para todos los fans de la cultura coreana.";
        setProduct(data);
      } catch (err) {
        setError('Producto no encontrado.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Se re-ejecuta si el ID del producto en la URL cambia


  // --- Handlers (Manejadores de eventos) ---

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount)); // Mínimo 1
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Verificamos si el item ya está en el carrito
    const itemInCart = cart.find(item => item.id === product.id);

    if (itemInCart) {
      // Si está, actualizamos su cantidad
      updateQuantity(product.id, itemInCart.quantity + quantity);
    } else {
      // Si es nuevo, lo añadimos (la lógica del reducer lo pone con cantidad 1)
      // Así que primero lo añadimos, y luego actualizamos a la cantidad deseada.
      addToCart(product);
      // Hacemos esto para manejar el caso de añadir > 1 a un item nuevo
      updateQuantity(product.id, quantity); 
    }

    // Opcional: Mostrar una notificación
    alert(`${quantity} ${product.name} añadido(s) al carrito!`);
    // Reseteamos la cantidad a 1
    setQuantity(1);
  };

  // --- Renderizado ---

  if (isLoading) {
    return <p className={styles.loadingText}>Cargando producto...</p>;
  }

  if (error || !product) {
    return <p className={styles.errorText}>{error || 'No se pudo cargar el producto.'}</p>;
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.productGrid}>

        {/* Columna 1: Galería de Imágenes */}
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}>
            <img src={product.imageUrl} alt={product.name} />
          </div>
          {/* Aquí podrían ir thumbnails de imágenes extra */}
        </div>

        {/* Columna 2: Detalles del Producto */}
        <div className={styles.productDetails}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.rating}>
            <Rating rating={product.rating} reviews={product.reviews} />
          </div>

          <div>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className={styles.cartActions}>
            <div className={styles.quantitySelector}>
              <button 
                className={styles.quantityButton} 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <FiMinus />
              </button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button 
                className={styles.quantityButton} 
                onClick={() => handleQuantityChange(1)}
              >
                <FiPlus />
              </button>
            </div>
            <button 
              className={styles.addToCartButton}
              onClick={handleAddToCart}
            >
              Añadir al Carrito ({formatPrice(product.price * quantity)})
            </button>
          </div>

          <div className={styles.description}>
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;