"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "@/services/tmdb";
import { TMDBMovieDetails } from "@/types/tmdb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MovieOverview from "@/components/movie/MovieOverview";
import MovieCast from "@/components/movie/MovieCast";
import MovieReviews from "@/components/movie/MovieReviews";
import MovieMedia from "@/components/movie/MovieMedia";
import SimilarMovies from "@/components/movie/SimilarMovies";
import Loading from "@/components/common/Loading";
import { Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/services/tmdb";
import { TMDBGenre } from "@/types/tmdb";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await fetchMovieDetails(Number(id));
        setMovie(data);
      } catch (error) {
        console.error("Error loading movie:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (loading) {
    return <Loading message="Loading movie details..." />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Error loading movie
          </h1>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: movie.title,
        text: `Check out ${movie.title} on CineHub!`,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getImageUrl(
              movie.backdrop_path || null,
              "original"
            )})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/80 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex gap-8">
            {/* Poster */}
            <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-xl">
              <img
                src={getImageUrl(movie.poster_path || null, "w500")}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                <div className="text-white/80">
                  {new Date(movie.release_date).getFullYear()}
                </div>
                {movie.runtime && (
                  <div className="text-white/80">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre: TMDBGenre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-white/10 rounded-full text-white text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <Button
                onClick={handleShare}
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cast">Cast</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="similar">Similar Movies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <MovieOverview movie={movie} />
          </TabsContent>

          <TabsContent value="cast">
            {movie.credits && <MovieCast credits={movie.credits} />}
          </TabsContent>

          <TabsContent value="reviews">
            {movie.reviews && <MovieReviews reviews={movie.reviews} />}
          </TabsContent>

          <TabsContent value="media">
            {movie.videos && <MovieMedia videos={movie.videos} />}
          </TabsContent>

          <TabsContent value="similar">
            {movie.similar && <SimilarMovies movies={movie.similar} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
