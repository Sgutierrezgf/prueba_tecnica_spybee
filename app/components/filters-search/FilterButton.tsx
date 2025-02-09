import React from "react";
import "./filterbutton.css";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSort: (criteria: "title" | "incidents" | "RFI" | "tasks") => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onSort }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Filtrar resultados</h3>
        <div className="filter-options">
          <button onClick={() => onSort("title")}>Ordenar por Título</button>
          <button onClick={() => onSort("incidents")}>Ordenar por Incidencias</button>
          <button onClick={() => onSort("RFI")}>Ordenar por RFI</button>
          <button onClick={() => onSort("tasks")}>Ordenar por Tareas</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
