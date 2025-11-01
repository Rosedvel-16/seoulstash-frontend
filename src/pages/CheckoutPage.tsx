// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Para saber QUIÉN compra
import { useCart } from '../context/CartContext'; // Para saber QUÉ compra
import { createOrderInFirestore } from '../services/api'; // La función que creamos
import styles from './CheckoutPage.module.css';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';

// Función helper para formatear precios
const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

const CheckoutPage: React.FC = () => {
  // 1. Obtener los datos que necesitamos
  const { currentUser } = useAuth();
  const { cart, totalPrice, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  // 2. Estados del formulario (solo para simulación, no los validamos)
  const [email, setEmail] = useState(currentUser?.email || '');
  const [name, setName] = useState(currentUser?.displayName || '');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  
  // Estados de la UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Costo de envío (simulado, igual que en el carrito)
  const shippingCost = itemCount > 0 ? 5.99 : 0;
  const totalWithShipping = totalPrice + shippingCost;

  // 3. Lógica de "Pagar"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 4. Validaciones
    if (!currentUser) {
      setError('Debes iniciar sesión para comprar.');
      return;
    }
    if (itemCount === 0) {
      setError('Tu carrito está vacío.');
      return;
    }
    
    setLoading(true);

    try {
      // 5. ¡Llamada a la API!
      // Creamos el pedido en Firestore
      const newOrderId = await createOrderInFirestore(
        currentUser.uid,
        cart,
        totalWithShipping
      );

      // 6. ¡Éxito!
      setLoading(false);
      clearCart(); // Vaciamos el carrito
      
      // 7. Redirigimos a la página de "Éxito"
      // (La crearemos en el siguiente paso)
      navigate(`/order-success?orderId=${newOrderId}`);

    } catch (err) {
      setLoading(false);
      setError('Error al procesar el pago. Intenta de nuevo.');
      console.error(err);
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <form onSubmit={handleSubmit}>
        <div className={styles.checkoutGrid}>
          
          {/* --- Columna Izquierda: Formulario --- */}
          <div className={styles.formColumn}>
            
            {/* Sección de Contacto y Envío */}
            <section className={styles.formSection}>
              <h2>Contacto y Envío</h2>
              <div className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Correo Electrónico</label>
                  <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="address">Dirección de Envío</label>
                  <input type="text" id="address" placeholder="Av. Siempre Viva 123" value={address} onChange={e => setAddress(e.target.value)} required />
                </div>
              </div>
            </section>
            
            {/* Sección de Pago (Simulada) */}
            <section className={styles.formSection}>
              <h2>Método de Pago (Simulación)</h2>
              <div className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="nameOnCard">Nombre en la Tarjeta</label>
                  <input type="text" id="nameOnCard" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="cardNumber">Número de Tarjeta</label>
                  <div className={styles.fakeCardInput}>
                    <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />
                    <span><FaCcVisa /> <FaCcMastercard /></span>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="expiry">Expiración (MM/AA)</label>
                    <input type="text" id="expiry" placeholder="MM/AA" required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="cvc">CVC</label>
                    <input type="text" id="cvc" placeholder="123" required />
                  </div>
                </div>
              </div>
            </section>
            
            {error && <p className={styles.errorMessage}>{error}</p>}

            <button type="submit" className={styles.submitButton} disabled={loading || itemCount === 0}>
              {loading ? 'Procesando pago...' : `Pagar ${formatPrice(totalWithShipping)}`}
            </button>
            
          </div>
          
          {/* --- Columna Derecha: Resumen del Pedido --- */}
          <aside className={styles.summaryColumn}>
            <h2>Resumen del Pedido</h2>
            {itemCount === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className={styles.summaryItem}>
                    <div className={styles.summaryItemImage}>
                      <img src={item.imageUrl} alt={item.name} />
                    </div>
                    <div className={styles.summaryItemDetails}>
                      <p className={styles.summaryItemName}>{item.name}</p>
                      <p className={styles.summaryItemQty}>Qty: {item.quantity}</p>
                    </div>
                    <p className={styles.summaryItemPrice}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Envío</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total</span>
                  <span>{formatPrice(totalWithShipping)}</span>
                </div>
              </>
            )}
          </aside>
          
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;