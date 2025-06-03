"use client";

import React from "react";
import { useTVShows } from "@/hooks/useTMDB";
import { TMDBTVShow } from "@/types/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import { TVShowCard } from "@/components/common/TVShowCard";

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array(24).fill(0).map((_, index) => (
          <div key={index} className="group relative cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="relative aspect-[2/3] w-full">
                <div className="absolute inset-0 bg-[#1B263B]">
                  <Skeleton className="w-full h-full" />
                </div>
              </div>
              <div className="mt-3 px-2">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {displayShows.map((show: TMDBTVShow) => (
        <TVShowCard key={show.id} show={show} />
      ))}
    </div>
  );
};

export default TVShowList;
