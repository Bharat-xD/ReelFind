import React from "react";

const FALLBACK_POSTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="210" height="295" viewBox="0 0 210 295">
      <rect width="210" height="295" fill="#232838"/>
      <text x="50%" y="50%" fill="#5B6480" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">No Poster</text>
    </svg>`
  );

function MovieCard({ movie }) {
  const { title, year, type, posterUrl } = movie;

  return (
    <div className="movie-card">
      <img
        className="movie-poster"
        src={posterUrl || FALLBACK_POSTER}
        alt={`${title} poster`}
        loading="lazy"
      />
      <div className="movie-info">
        <p className="movie-title">{title}</p>
        <div className="movie-meta">
          <span>{year || "—"}</span>
          <span className="movie-type">{type || "Unknown"}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;