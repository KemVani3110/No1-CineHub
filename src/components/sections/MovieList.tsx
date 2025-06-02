'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/components/common/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getMovies, getTVShows } from '@/services/tmdb';

interface MovieListProps {
  listType: string;
  apiPath?: string;
}

const MovieList: React.FC<MovieListProps> = ({ listType, apiPath = 'movies' }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [apiPath, listType],
    queryFn: async () => {
      try {
        if (apiPath === 'tv') {
          return getTVShows(listType);
        }
        return getMovies(listType as any);
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-xl bg-[#1B263B]" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-[#1B263B]" />
              <Skeleton className="h-4 w-1/2 bg-[#1B263B]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('MovieList error:', error);
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error loading data</div>
          <div className="text-gray-400">{(error as Error).message || 'Please try again later'}</div>
        </div>
      </div>
    );
  }

  if (!data?.results?.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl">No items found</div>
          <div className="text-gray-500">Try a different category</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {data.results.slice(0, 20).map((item: any) => (
        <MovieCard key={item.id} movie={item} />
      ))}
    </div>
  );
};

export default MovieList; 