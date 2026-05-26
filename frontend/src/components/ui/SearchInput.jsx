import { Search } from "lucide-react";

import "../css/SearchInput.css";

const SearchInput = ({ placeholder = "Search...", value, onChange }) => {
  return (
    <div className="search-input-container">
      <Search size={18} />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchInput;
