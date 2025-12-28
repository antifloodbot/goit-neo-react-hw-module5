import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieCredits, IMG_500 } from "../../api/tmdb.js";
import css from "./MovieCast.module.css";

export default function MovieCast() {
  const { movieId } = useParams();

  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCast() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getMovieCredits(movieId);
        if (isMounted) setCast(data);
      } catch {
        if (isMounted) setError("Failed to load cast.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchCast();
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className={css.error}>{error}</p>;
  if (!cast.length) return <p>No cast information.</p>;

  return (
    <ul className={css.list}>
      {cast.map((person) => (
        <li key={person.cast_id ?? person.credit_id} className={css.item}>
          {person.profile_path ? (
            <img
              className={css.img}
              src={`${IMG_500}${person.profile_path}`}
              alt={person.name}
            />
          ) : (
            <div className={css.noImg}>No photo</div>
          )}
          <p className={css.name}>{person.name}</p>
          <p className={css.role}>Character: {person.character || "—"}</p>
        </li>
      ))}
    </ul>
  );
}