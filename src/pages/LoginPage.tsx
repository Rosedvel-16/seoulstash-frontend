// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importamos el hook
import styles from './AuthForm.module.css'; // 2. Importamos los estilos

const LoginPage: React.FC = () => {
  // 3. Creamos estados para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 4. Obtenemos las funciones del contexto y de routing
  const { login } = useAuth();
  const navigate = useNavigate(); // Para redirigir al usuario

  // 5. Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setError(null); // Limpia errores antiguos
    setLoading(true); // Muestra el 'loading'

    try {
      // 6. ¡Llamamos a la función 'login' de nuestro AuthContext!
      await login(email, password);
      
      // 7. Si tiene éxito, redirigimos al perfil
      navigate('/profile'); 
      
    } catch (err: any) {
      // 8. Si falla, mostramos un error amigable
      if (err.code === 'auth/invalid-credential') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.');
      }
      setLoading(false); // Reactiva el botón
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <p className={styles.subtitle}>¡Bienvenido de vuelta a SeoulStash!</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* Muestra el error si existe */}
          {error && <p className={styles.errorMessage}>{error}</p>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className={styles.toggleLink}>
          ¿No tienes una cuenta? <Link to="/register">Crea una aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;