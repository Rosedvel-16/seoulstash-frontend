// src/components/CategoryCard/CategoryCard.tsx (Actualizado)
import React from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../types';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    // ¡ENLACE CORREGIDO!
    // Usamos category.slug (ej. "k-beauty") en lugar de category.id (ej. "WTiOU...")
    <Link to={`/products/${category.slug}`} className={styles.card}>
      
      <picture className={styles.cardBackground}>
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