// src/components/Rating/Rating.tsx
import React from 'react';
// Usaremos íconos de estrellas
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import styles from './Rating.module.css';

interface RatingProps {
  rating: number;
  reviews: number;
}

const Rating: React.FC<RatingProps> = ({ rating, reviews }) => {
  const stars = [];
  // Lógica para mostrar estrellas llenas, medias o vacías
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} />);
    } else {
      stars.push(<FaRegStar key={i} />);
    }
  }

  return (
    <div className={styles.rating}>
      <span className={styles.stars}>{stars}</span>
      <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
      <span className={styles.reviewCount}>({reviews})</span>
    </div>
  );
};

export default Rating;