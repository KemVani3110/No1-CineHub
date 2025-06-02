'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTVShows, getImageUrl } from '@/services/tmdb';
import { TMDBTVShow } from '@/types/tmdb';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Star, Calendar, Play } from 'lucide-react';
import Link from 'next/link';

interface TVShowListProps {
  listType: 'popular' | 'top_rated' | 'on_the_air';
  title?: string;
}

const TVShowList = ({ listType, title }: TVShowListProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tvShows', listType],
    queryFn: () => getTVShows(listType),
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
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error loading TV shows</div>
          <div className="text-gray-400">{(error as Error).message || 'Please try again later'}</div>
        </div>
      </div>
    );
  }

  if (!data?.results?.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl">No TV shows found</div>
          <div className="text-gray-500">Try a different category</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {data.results.map((show: TMDBTVShow) => (
        <Link href={`/tv/${show.id}`} key={show.id}>
          <div className="movie-card group relative overflow-hidden rounded-xl bg-[#1B263B] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#4FD1C5]/20">
            {/* Poster Image */}
            <div className="relative aspect-[2/3] w-full overflow-hidden">
              <Image
                src={getImageUrl(show.poster_path)}
                alt={show.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button className="rounded-full bg-[#4FD1C5] p-3 text-white shadow-lg transition-transform duration-300 hover:scale-110">
                  <Play className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Info Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B263B] via-[#1B263B]/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white line-clamp-2">{show.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{new Date(show.first_air_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#4FD1C5]/20 px-2 py-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{show.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TVShowList; 