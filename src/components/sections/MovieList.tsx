'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/components/common/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMovies, TMDBMovieListType } from '@/services/tmdb';
import { format } from 'date-fns';

interface MovieListProps {
  listType: TMDBMovieListType;
  apiPath?: string;
}

const MovieList = ({ listType }: MovieListProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['movies', listType],
    queryFn: () => fetchMovies(listType),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="group relative cursor-pointer h-full">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B263B] via-[#1E2A47] to-[#0F1419] shadow-xl h-full flex flex-col border border-[#2A3441]/50">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl">
                <div className="absolute inset-0">
                  <Skeleton className="w-full h-full bg-[#1B263B]" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between min-h-[140px]">
                <Skeleton className="h-6 w-3/4 bg-[#1B263B] mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 bg-[#1B263B]" />
                  <Skeleton className="h-4 w-16 bg-[#1B263B]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error loading movies</div>
          <div className="text-gray-400">
            {(error as Error).message || "Please try again later"}
          </div>
        </div>
      </div>
    );
  }

  if (!data?.results?.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl">No movies found</div>
          <div className="text-gray-500">Try a different category</div>
        </div>
      </div>
    );
  }

  // Filter upcoming movies to show only future releases
  const filteredMovies = listType === 'upcoming' 
    ? data.results.filter(movie => {
        const releaseDate = new Date(movie.release_date);
        return releaseDate > new Date();
      })
    : data.results;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {filteredMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList; 