"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "@/services/tmdb";
import { TMDBMovieDetails } from "@/types/tmdb";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, BookmarkPlus } from "lucide-react";
import { VideoPlayer } from "@/components/common/VideoPlayer";
import { MovieInfo } from "@/components/watch/MovieInfo";
import { MovieActions } from "@/components/watch/MovieActions";
import { SimilarMovies } from "@/components/watch/SimilarMovies";
import { Comments } from "@/components/watch/Comments";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function WatchPage() {
  const { id } = useParams();
  const router = useRouter();
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

  const handleShare = async () => {
    if (!movie) return;
    try {
      await navigator.share({
        title: movie.title,
        text: `Watch ${movie.title} on CineHub!`,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return <WatchPageSkeleton />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-red-500">
            Error loading movie
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-[#4fd1c5] hover:bg-white/10 cursor-pointer"
          onClick={() => router.push(`/movie/${id}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Video Player */}
          <div className="w-full">
            <VideoPlayer
              videoUrl={`/api/stream/movie/${id}`}
              posterUrl={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : undefined}
              title={movie.title}
              duration={movie.runtime}
            />
          </div>

          {/* Movie Info and Actions */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <MovieInfo movie={movie} />
              <MovieActions title={movie.title} onShare={handleShare} />
              <Comments
                mediaId={movie.id}
                mediaType="movie"
                mediaTitle={movie.title}
              />
            </div>
          </div>

          {/* Similar Movies */}
          <SimilarMovies movies={movie.similar || []} />
        </div>
      </div>
    </div>
  );
}

function WatchPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="w-full aspect-video" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-[200px] flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 