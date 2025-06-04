"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "@/services/tmdb";
import { TMDBMovieDetails } from "@/types/tmdb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MovieOverview from "@/components/movie/MovieOverview";
import MovieCast from "@/components/movie/MovieCast";
import MovieReviews from "@/components/movie/MovieReviews";
import SimilarMovies from "@/components/movie/SimilarMovies";
import MovieMedia from "@/components/movie/MovieMedia";
import {
  Play,
  Share2,
  BookmarkPlus,
  Youtube,
  Film,
} from "lucide-react";
import { getImageUrl } from "@/services/tmdb";
import { TMDBGenre } from "@/types/tmdb";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
    return <MovieDetailSkeleton />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Error loading movie
          </h1>
          <p className="text-slate-400">Please try again later</p>
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

  const handleTrailerClick = () => {
    if (movie?.videos?.results) {
      const trailer = movie.videos.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        setSelectedVideo(trailer.key);
      }
    }
  };

  const handleTeaserClick = () => {
    if (movie?.videos?.results) {
      const teaser = movie.videos.results.find(
        (video) => video.type === "Teaser" && video.site === "YouTube"
      );
      if (teaser) {
        setSelectedVideo(teaser.key);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getImageUrl(
              movie.backdrop_path || null,
              "original"
            )})`,
          }}
        >
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-7xl">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <div className="relative w-64 lg:w-80 h-[384px] lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-[#2e3c51] hover:border-[#4fd1c5] transition-all duration-300">
                <img
                  src={getImageUrl(movie.poster_path || null, "w500")}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-8">
              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-[#e0e6ed]">
                  {movie.title}
                </h1>
                <p className="text-xl text-[#9aafc3] italic">
                  {movie.tagline || "No tagline available"}
                </p>
              </div>

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: TMDBGenre) => (
                  <Badge
                    key={genre.id}
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium bg-[#1b263b] border-[#4fd1c5]/30 text-[#4fd1c5] hover:bg-[#4fd1c5]/10 cursor-pointer transition-all duration-300"
                  >
                    {genre.name.toUpperCase()}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#0d1b2a] px-8 py-3 rounded-full font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    WATCH
                  </Button>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#2e3c51] text-[#e0e6ed] hover:bg-[#1b263b] hover:border-[#4fd1c5] hover:text-[#4fd1c5] px-6 py-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#2e3c51] text-[#e0e6ed] hover:bg-[#1b263b] hover:border-[#4fd1c5] hover:text-[#4fd1c5] px-6 py-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    <BookmarkPlus className="w-5 h-5 mr-2" />
                    Watchlist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-20 mt-10">
        <div className="container mx-auto px-6 pb-24">
          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 bg-[#1b263b] border border-[#2e3c51] rounded-lg p-1 mb-12">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-[#4fd1c5] data-[state=active]:text-[#0d1b2a] text-[#9aafc3] hover:text-[#e0e6ed] cursor-pointer transition-all duration-300"
              >
                Overall
              </TabsTrigger>
              <TabsTrigger
                value="cast"
                className="data-[state=active]:bg-[#4fd1c5] data-[state=active]:text-[#0d1b2a] text-[#9aafc3] hover:text-[#e0e6ed] cursor-pointer transition-all duration-300"
              >
                Cast
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-[#4fd1c5] data-[state=active]:text-[#0d1b2a] text-[#9aafc3] hover:text-[#e0e6ed] cursor-pointer transition-all duration-300"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="data-[state=active]:bg-[#4fd1c5] data-[state=active]:text-[#0d1b2a] text-[#9aafc3] hover:text-[#e0e6ed] cursor-pointer transition-all duration-300"
              >
                Media
              </TabsTrigger>
              <TabsTrigger
                value="similar"
                className="data-[state=active]:bg-[#4fd1c5] data-[state=active]:text-[#0d1b2a] text-[#9aafc3] hover:text-[#e0e6ed] cursor-pointer transition-all duration-300"
              >
                Similar
              </TabsTrigger>
            </TabsList>

            <div>
              <TabsContent value="overview" className="mt-0">
                <MovieOverview movie={movie} />
              </TabsContent>

              <TabsContent value="cast" className="mt-0">
                <MovieCast
                  credits={movie.credits || null}
                  isLoading={loading}
                />
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <MovieReviews
                  reviews={
                    movie.reviews || {
                      page: 1,
                      results: [],
                      total_pages: 0,
                      total_results: 0,
                    }
                  }
                />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <MovieMedia 
                  videos={movie.videos || { results: [] }} 
                  movieTitle={movie.title}
                />
              </TabsContent>

              <TabsContent value="similar" className="mt-0">
                <SimilarMovies movies={movie.similar || []} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-7xl">
            <Skeleton className="w-64 lg:w-80 h-[384px] lg:h-[480px] rounded-2xl" />
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24" />
                ))}
              </div>
              <div className="flex gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-32" />
                ))}
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
