import React from 'react';
import styles from './StaticPageLayout.module.css'; // Crearemos este archivo ahora

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ title, children }) => {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default StaticPageLayout;
