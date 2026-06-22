import { useRef, useState } from "react";
import "./SearchBar.css";

export default function SearchBar({
  query,
  setQuery,
  selected,
  setSelected,
  suggestions,
  onSelectSuggestion,
  onSubmit,
  disabled,
}) {
  const inputRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelected(null);
    setDropdownOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && selected) onSubmit(selected);
    if (e.key === "Escape") {
      setSelected(null);
      setQuery("");
      setDropdownOpen(false);
    }
  };

  const handleSelect = (c) => {
    onSelectSuggestion(c);
    setDropdownOpen(false);
    inputRef.current?.blur();
  };

  const showDropdown = dropdownOpen && suggestions.length > 0;

  return (
    <div className="searchbar">
      <div className="searchbar__row">
        <input
          ref={inputRef}
          className="searchbar__input"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && !selected && setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          placeholder="Search character or anime…"
          disabled={disabled}
          autoComplete="off"
        />
        <button
          className="searchbar__btn"
          onClick={() => selected && onSubmit(selected)}
          disabled={!selected || disabled}
        >
          GUESS
        </button>
      </div>

      {showDropdown && (
        <ul className="searchbar__dropdown">
          {suggestions.map((c) => (
            <li
              key={c.name}
              className={`searchbar__option${selected?.name === c.name ? " searchbar__option--active" : ""}`}
              onMouseDown={() => handleSelect(c)}
            >
              <span className="searchbar__option-name">{c.name}</span>
              <span className="searchbar__option-anime">{c.anime.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
