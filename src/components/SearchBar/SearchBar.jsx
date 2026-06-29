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
  hint
}) {
  const inputRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelected(null);
    setActiveIndex(-1);
    setDropdownOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        handleSelect(suggestions[activeIndex]);
      } else if (selected) {
        onSubmit(selected);
        setActiveIndex(-1);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    } else if (e.key === "Escape") {
      setSelected(null);
      setQuery("");
      setDropdownOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleSelect = (c) => {
    onSelectSuggestion(c);
    setDropdownOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const showDropdown = dropdownOpen && suggestions.length > 0;

  return (
    <div className="searchbar">
      <div className="searchbar__row-wrapper">
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
      {hint && <div className="searchbar__hint-slot">{hint}</div>}
      </div>
      {showDropdown && (
        <ul className="searchbar__dropdown">
          {suggestions.map((c, i) => (
            <li
              key={c.name}
              className={`searchbar__option${i === activeIndex ? " searchbar__option--active" : ""}`}
              onMouseDown={() => handleSelect(c)}
              onMouseEnter={() => setActiveIndex(i)}
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
