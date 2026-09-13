import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import "./App.css";

const DEBOUNCE_DELAY = 500; // delay (when typing stops)

function App() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce effect 
  // Runs every time `query` changes, schedules an update to `debouncedQuery` after DEBOUNCE_DELAY ms. If the user types again before that timer fires, the cleanup function cancels the pending timer, so only the *last* keystroke in a burst actually triggers a state update.
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timerId);
  }, [query]);

  // Fetch effect
  // Runs only when `debouncedQuery` changes.
  useEffect(() => {
    if (debouncedQuery === "") {
      setMovies([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false; // guard for an an out-of-order response

    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(debouncedQuery)}`
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        const results = data.map((entry) => ({
          id: entry.show.id,
          title: entry.show.name,
          year: entry.show.premiered ? entry.show.premiered.slice(0, 4) : null,
          type: entry.show.type,
          posterUrl: entry.show.image ? entry.show.image.medium : null,
        }));

        if (!isCancelled) {
          setMovies(results);
        }
      } catch (err) {
        if (!isCancelled) {
          setError("Couldn't load results. Please try again.");
          setMovies([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchMovies();

    // If debouncedQuery changes again before this fetch finishes mark this run as cancelled so its result is ignored.
    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <div className="page">
      <div className="app-wrap">
        <h1 className="app-title">Movie Search</h1>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie or show…"
          className="search-input"
          aria-label="Search movies"
        />

        {isLoading && <p className="status-text">Searching…</p>}

        {!isLoading && error && <p className="status-text status-error">{error}</p>}

        {!isLoading && !error && debouncedQuery !== "" && movies.length === 0 && (
          <p className="status-text">No results for "{debouncedQuery}".</p>
        )}

        {!isLoading && !error && movies.length > 0 && (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;