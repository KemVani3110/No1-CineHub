import { TMDBMovie } from "@/types/tmdb";
import { MovieCard } from "@/components/common/MovieCard";

interface SimilarMoviesProps {
  movies: TMDBMovie[];
}

export default function SimilarMovies({ movies }: SimilarMoviesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.slice(0, 12).map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
