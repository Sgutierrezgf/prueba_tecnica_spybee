import { ChangeEvent } from "react";
import "./searchinput.css";

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ searchTerm, onSearchChange }: SearchInputProps) => {
  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Buscar por nombre de proyecto"
        className="search-input"
      />
    </div>
  );
};

export default SearchInput;
