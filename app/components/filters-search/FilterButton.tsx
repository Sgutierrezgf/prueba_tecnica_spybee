import React from "react";
import "./filterbutton.css"; 

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSortByTitle: () => void;
  onSortByIncidents: () => void;
  onSortByRFI: () => void;
  onSortByTasks: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onSortByTitle,
  onSortByIncidents,
  onSortByRFI,
  onSortByTasks,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Filtrar resultados</h3>
        <div className="filter-options">
          <button onClick={onSortByTitle}>Ordenar por Título</button>
          <button onClick={onSortByIncidents}>Ordenar por Incidencias</button>
          <button onClick={onSortByRFI}>Ordenar por RFI</button>
          <button onClick={onSortByTasks}>Ordenar por Tareas</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
