// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Aún mostrará error, ¡está bien!
import styles from './AuthForm.module.css';

const RegisterPage: React.FC = () => {
  // 1. ¡Añadimos estado para el nombre!
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (displayName.trim() === '') {
      setError('Por favor, ingresa un nombre de usuario.');
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      // 2. ¡Ahora pasamos los 3 argumentos!
      // (Esto seguirá rojo hasta que arreglemos AuthContext)
      await register(email, password, displayName);
      
      navigate('/profile'); 
      
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Error al registrar la cuenta. Intenta de nuevo.');
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Crear Cuenta</h1>
        <p className={styles.subtitle}>Únete a la comunidad de SeoulStash</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          
          {error && <p className={styles.errorMessage}>{error}</p>}
          
          {/* 3. ¡Nuevo campo de Nombre de Usuario añadido! */}
          <div className={styles.inputGroup}>
            <label htmlFor="displayName">Nombre de Usuario</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          
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
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className={styles.toggleLink}>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;