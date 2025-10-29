import React from 'react';
import styles from './Sidebar.module.css';

// 1. Importamos nuestros tipos de Filtro
// Asegúrate que la ruta sea correcta (src/components/Sidebar -> src)
import type { Filter, FilterOption } from '../../types';

// --- Sub-componentes para construir el Sidebar ---

// Componente para un grupo de filtros (ej. "Tipo de Piel")
const FilterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className={styles.filterGroup}>
    <h4 className={styles.groupTitle}>{title}</h4>
    {children}
  </div>
);

// Componente para una opción de checkbox
const FilterCheckbox: React.FC<{ option: FilterOption }> = ({ option }) => (
  <label className={styles.checkboxLabel}>
    <input type="checkbox" name={option.label} />
    <span className={styles.checkboxText}>{option.label}</span>
    <span className={styles.checkboxCount}>{option.count}</span>
  </label>
);

// Componente para un filtro de rango de precio
const FilterPriceRange: React.FC<{ filter: Filter }> = ({ filter }) => (
  <div className={styles.priceRangeContainer}>
    <input 
      type="range" 
      min={filter.min || 0} 
      max={filter.max || 100} 
      defaultValue={filter.max || 100} // Valor inicial
      className={styles.priceRange} 
    />
    <div className={styles.priceValues}>
      <span>${filter.min || 0}</span>
      <span>${filter.max || 100}</span>
    </div>
  </div>
);


// --- Componente Principal del Sidebar ---

// 2. Definimos las Props: ahora recibe una lista de filtros
interface SidebarProps {
  filters: Filter[];
}

const Sidebar: React.FC<SidebarProps> = ({ filters }) => {
  
  // 3. Función para "dibujar" el filtro correcto según su tipo
  const renderFilter = (filter: Filter) => {
    switch (filter.type) {
      case 'checkbox':
        return (
          <FilterGroup key={filter.id} title={filter.title}>
            {filter.options?.map(option => (
              <FilterCheckbox key={option.label} option={option} />
            ))}
          </FilterGroup>
        );
      case 'priceRange':
        return (
          <FilterGroup key={filter.id} title={filter.title}>
            <FilterPriceRange filter={filter} />
          </FilterGroup>
        );
      default:
        return null;
    }
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Filtros</h3>

      {/* 4. Verificamos si hay filtros para mostrar */}
      {filters.length > 0 ? (
        <>
          {/* 5. Iteramos sobre los filtros y los renderizamos */}
          {filters.map(filter => renderFilter(filter))}
          <button className={styles.applyButton}>Aplicar Filtros</button>
        </>
      ) : (
        // 6. Mostramos un mensaje si no hay filtros (ej. para K-Fashion)
        <p className={styles.noFiltersText}>
          No hay filtros disponibles para esta categoría.
        </p>
      )}
    </aside>
  );
};

export default Sidebar;