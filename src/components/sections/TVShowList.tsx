"use client";

import React from "react";
import { useTVShows } from "@/hooks/useTMDB";
import { TMDBTVShow } from "@/types/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/services/tmdb";
import Link from "next/link";

interface TVShowListProps {
  listType: 'popular' | 'top_rated' | 'on_the_air';
}

const TVShowList = ({ listType }: TVShowListProps) => {
  const { data: page1Data, isLoading: isLoadingPage1 } = useTVShows(listType, 1);
  const { data: page2Data, isLoading: isLoadingPage2 } = useTVShows(listType, 2);

  const isLoading = isLoadingPage1 || isLoadingPage2;
  const allShows = [...(page1Data?.results || []), ...(page2Data?.results || [])];

  // Filter shows based on list type
  const filteredShows = allShows.filter((show: TMDBTVShow) => {
    if (listType === 'on_the_air') {
      // For upcoming shows, check if the next episode air date is in the future
      const nextEpisodeDate = show.next_episode_to_air?.air_date;
      if (!nextEpisodeDate) return false;
      return new Date(nextEpisodeDate) > new Date();
    }
    return true;
  });

  // Get the first 24 shows
  const displayShows = filteredShows.slice(0, 24);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array(24).fill(0).map((_, index) => (
          <div key={index} className="relative aspect-[2/3] rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!displayShows.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No TV shows found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {displayShows.map((show: TMDBTVShow) => (
        <Link 
          href={`/tv/${show.id}`} 
          key={show.id}
          className="group relative aspect-[2/3] rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105"
        >
          <img
            src={getImageUrl(show.poster_path)}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-sm line-clamp-2">{show.name}</h3>
              {show.next_episode_to_air && (
                <p className="text-gray-300 text-xs mt-1">
                  Next episode: {new Date(show.next_episode_to_air.air_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TVShowList;
