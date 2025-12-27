import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import css from "./SearchBar.module.css";

export default function SearchBar({ onSubmit }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <header className={css.header}>
      <form className={css.form} onSubmit={handleSubmit}>
        <button type="submit" className={css.iconBtn} aria-label="Search">
          <FiSearch />
        </button>

        <input
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </header>
  );
}