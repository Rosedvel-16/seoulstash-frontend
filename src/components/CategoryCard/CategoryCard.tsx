// src/components/CategoryCard/CategoryCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../types'; // Importamos nuestro tipo
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    // Enlazamos la tarjeta completa a la página de esa categoría
    <Link to={`/products/${category.id}`} className={styles.card}>
      {/* Usamos un <picture> para superponer la imagen de fondo */}
      <picture className={styles.cardBackground}>
        {/* NOTA: Usamos category.imageUrl, que definimos en api.ts.
          Como aún no tenemos esas imágenes, se verá vacío, 
          pero lo arreglaremos luego.
        */}
        <img src={category.imageUrl} alt={category.name} />
      </picture>
      <div className={styles.cardOverlay}></div>
      <div className={styles.cardContent}>
        <h3>{category.name}</h3>
        <span>{category.productCount} productos</span>
      </div>
    </Link>
  );
};

export default CategoryCard;