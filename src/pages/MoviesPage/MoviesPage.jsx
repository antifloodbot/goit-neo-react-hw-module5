import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieList from "../../components/MovieList/MovieList.jsx";
import { searchMovies } from "../../api/tmdb.js";
import css from "./MoviesPage.module.css";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const value = form.elements.query.value.trim();

    if (!value) return;

    setSearchParams({ query: value });
    form.reset();
  };

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setError("");
      return;
    }

    let isMounted = true;

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const data = await searchMovies(query);

        if (isMounted) setMovies(data);
      } catch {
        if (isMounted) setError("Failed to search movies.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return (
    <main className={css.page}>
      <form className={css.form} onSubmit={handleSubmit}>
        <input
          className={css.input}
          name="query"
          type="text"
          defaultValue={query}
          placeholder="Search movies..."
          autoComplete="off"
        />
        <button className={css.button} type="submit">
          Search
        </button>
      </form>

      {isLoading && <p>Loading...</p>}

      {!isLoading && error && <p className={css.error}>{error}</p>}

      {!isLoading && !error && !query && (
        <p className={css.hint}>Type a movie name and press Enter.</p>
      )}

      {!isLoading && !error && query && movies.length === 0 && (
        <p className={css.empty}>
          No movies found for “{query}”. Try another search.
        </p>
      )}

      {!isLoading && !error && movies.length > 0 && <MovieList movies={movies} />}
    </main>
  );
}