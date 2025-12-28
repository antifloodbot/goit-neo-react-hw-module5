import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { getMovieDetails, IMG_500 } from "../../api/tmdb.js";
import css from "./MovieDetailsPage.module.css";

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const location = useLocation();

  const backLinkRef = useRef(location.state ?? "/movies");

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchDetails() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getMovieDetails(movieId);
        if (isMounted) setMovie(data);
      } catch {
        if (isMounted) setError("Failed to load movie details.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  const getLinkClass = ({ isActive }) =>
    isActive ? css.activeLink : css.subLink;

  return (
    <main className={css.page}>
      <Link className={css.back} to={backLinkRef.current}>
        ← Go back
      </Link>

      {isLoading && <p>Loading...</p>}
      {error && <p className={css.error}>{error}</p>}

      {movie && (
        <>
          <div className={css.details}>
            {movie.poster_path && (
              <img
                className={css.poster}
                src={`${IMG_500}${movie.poster_path}`}
                alt={movie.title}
              />
            )}

            <div>
              <h1 className={css.title}>
                {movie.title}{" "}
                {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ""}
              </h1>

              <p>
                <b>User score:</b>{" "}
                {Math.round((movie.vote_average ?? 0) * 10)}%
              </p>

              <h2 className={css.sectionTitle}>Overview</h2>
              <p>{movie.overview || "No overview."}</p>

              <h2 className={css.sectionTitle}>Genres</h2>
              <p>
                {movie.genres?.length
                  ? movie.genres.map((g) => g.name).join(", ")
                  : "No genres."}
              </p>
            </div>
          </div>

          <hr className={css.hr} />

          <p className={css.subTitle}>Additional information</p>
          <div className={css.subNav}>
            <NavLink className={getLinkClass} to="cast">
              Cast
            </NavLink>
            <NavLink className={getLinkClass} to="reviews">
              Reviews
            </NavLink>
          </div>

          <hr className={css.hr} />

          <Outlet />
        </>
      )}
    </main>
  );
}