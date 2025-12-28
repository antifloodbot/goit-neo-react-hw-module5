import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieReviews } from "../../api/tmdb.js";
import css from "./MovieReviews.module.css";

export default function MovieReviews() {
  const { movieId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getMovieReviews(movieId);
        if (isMounted) setReviews(data);
      } catch {
        if (isMounted) setError("Failed to load reviews.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className={css.error}>{error}</p>;
  if (!reviews.length) return <p>No reviews.</p>;

  return (
    <ul className={css.list}>
      {reviews.map((r) => (
        <li key={r.id} className={css.item}>
          <p className={css.author}>
            <b>Author:</b> {r.author}
          </p>
          <p className={css.content}>{r.content}</p>
        </li>
      ))}
    </ul>
  );
}