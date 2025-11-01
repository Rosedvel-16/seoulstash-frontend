import React, { useState } from 'react'; // 1. Importamos 'useState'
import styles from './Sidebar.module.css';

// 2. Importamos nuestros tipos de Filtro Y el nuevo tipo 'SelectedFilters'
// (Asegúrate que la ruta '../../types' sea correcta para tu estructura)
import type { Filter, FilterOption, SelectedFilters } from '../../types';

// --- Sub-componente Checkbox (Actualizado) ---
// Ahora necesita saber si está marcado y qué hacer 'onChange'
interface FilterCheckboxProps {
  option: FilterOption;
  isChecked: boolean;
  onChange: () => void;
}
const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ option, isChecked, onChange }) => (
  <label className={styles.checkboxLabel}>
    <input 
      type="checkbox" 
      name={option.label}
      checked={isChecked} // 3. Controlado por el estado
      onChange={onChange}   // 4. Llama al handler
    />
    <span className={styles.checkboxText}>{option.label}</span>
    <span className={styles.checkboxCount}>{option.count}</span>
  </label>
);

// --- Sub-componente Rango de Precio (Sin cambios) ---
const FilterPriceRange: React.FC<{ filter: Filter }> = ({ filter }) => (
  <div className={styles.priceRangeContainer}>
    <input 
      type="range" 
      min={filter.min || 0} 
      max={filter.max || 100} 
      defaultValue={filter.max || 100}
      className={styles.priceRange} 
    />
    <div className={styles.priceValues}>
      <span>${filter.min || 0}</span>
      <span>${filter.max || 100}</span>
    </div>
  </div>
);

// --- Sub-componente Grupo de Filtros (Sin cambios) ---
const FilterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className={styles.filterGroup}>
    <h4 className={styles.groupTitle}>{title}</h4>
    {children}
  </div>
);


// --- Componente Principal del Sidebar (Actualizado) ---

interface SidebarProps {
  filters: Filter[];
  // 5. ¡Nueva Prop! Una función que se llamará al aplicar
  onApplyFilters: (selectedFilters: SelectedFilters) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, onApplyFilters }) => {
  
  // 6. ¡Estado Interno! Aquí recordamos qué está seleccionado
  // Ejemplo: { brand: ['COSRX', 'Laneige'], skinType: ['Seca'] }
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  // 7. Handler para cuando se marca/desmarca un checkbox
  const handleCheckboxChange = (filterId: string, optionLabel: string) => {
    // Obtenemos la lista actual de selecciones para este filtro (ej. 'brand')
    const currentSelections = selectedFilters[filterId] || [];
    let newSelections: string[];

    if (currentSelections.includes(optionLabel)) {
      // Si ya estaba, la quitamos (desmarcar)
      newSelections = currentSelections.filter(label => label !== optionLabel);
    } else {
      // Si no estaba, la añadimos (marcar)
      newSelections = [...currentSelections, optionLabel];
    }

    // Actualizamos el estado
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: newSelections
    }));
  };
  
  // 8. Handler para el botón "Aplicar Filtros"
  const handleApply = () => {
    // ¡Llama a la función del padre y le pasa los filtros!
    onApplyFilters(selectedFilters);
  };
  
  // (Lógica para el slider de precio (handlePriceChange) la omitimos por ahora)

  // Función para "dibujar" el filtro (actualizada)
  const renderFilter = (filter: Filter) => {
    switch (filter.type) {
      case 'checkbox':
        return (
          <FilterGroup key={filter.id} title={filter.title}>
            {filter.options?.map(option => {
              // Comprobamos si esta opción debe estar marcada
              const isChecked = selectedFilters[filter.id]?.includes(option.label) || false;
              return (
                <FilterCheckbox 
                  key={option.label} 
                  option={option}
                  isChecked={isChecked}
                  onChange={() => handleCheckboxChange(filter.id, option.label)}
                />
              );
            })}
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

      {filters.length > 0 ? (
        <>
          {filters.map(filter => renderFilter(filter))}
          {/* 9. Conectamos el botón a su handler */}
          <button 
            className={styles.applyButton} 
            onClick={handleApply}
          >
            Aplicar Filtros
          </button>
        </>
      ) : (
        <p className={styles.noFiltersText}>
          No hay filtros disponibles para esta categoría.
        </p>
      )}
    </aside>
  );
};

export default Sidebar;