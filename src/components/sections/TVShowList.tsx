"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTVShows, getImageUrl } from "@/services/tmdb";
import { TMDBTVShow } from "@/types/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Star, Calendar, Play, Tv } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface TVShowListProps {
  listType: "popular" | "top_rated" | "on_the_air";
  title?: string;
}

const TVShowCard = ({ show }: { show: TMDBTVShow }) => {
  const nextEpisodeDate = show.next_episode_to_air?.air_date;
  const isUpcoming = nextEpisodeDate && new Date(nextEpisodeDate) > new Date();

  return (
    <Link href={`/tv/${show.id}`} className="group relative">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl">
        <Image
          src={getImageUrl(show.poster_path)}
          alt={show.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 text-white/90 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{show.vote_average.toFixed(1)}</span>
          </div>
          {nextEpisodeDate && (
            <div className="flex items-center gap-2 text-white/90 mb-2">
              <Calendar className="w-4 h-4" />
              <span>
                {isUpcoming ? "Next: " : ""}
                {format(new Date(nextEpisodeDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
          <button className="w-full bg-[#4FD1C5] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#4FD1C5]/90 transition-colors">
            <Play className="w-4 h-4" />
            <span>Watch Now</span>
          </button>
        </div>
      </div>
      <div className="mt-3 px-2">
        <h3 className="font-semibold text-white line-clamp-1">{show.name}</h3>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Tv className="w-4 h-4" />
          <span>TV Series</span>
        </div>
      </div>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#4FD1C5]/0 to-[#4FD1C5]/0 group-hover:from-[#4FD1C5]/10 group-hover:to-[#38B2AC]/10 transition-all duration-500 -z-10 blur-xl" />
    </Link>
  );
};

const TVShowList = ({ listType, title }: TVShowListProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tvShows", listType],
    queryFn: () => fetchTVShows(listType),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-2xl bg-[#1B263B]" />
            <div className="space-y-2 px-4">
              <Skeleton className="h-4 w-3/4 bg-[#1B263B]" />
              <Skeleton className="h-3 w-1/2 bg-[#1B263B]" />
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
          <div className="text-gray-400 text-xl">No TV shows found</div>
          <div className="text-gray-500">Try a different category</div>
        </div>
      </div>
    );
  }

  // Filter TV shows based on next episode date
  const filteredShows = listType === 'on_the_air'
    ? data.results.filter((show: TMDBTVShow) => {
        const nextEpisodeDate = show.next_episode_to_air?.air_date;
        return nextEpisodeDate && new Date(nextEpisodeDate) > new Date();
      })
    : data.results;

  if (listType === 'on_the_air' && filteredShows.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl">No shows currently on air</div>
          <div className="text-gray-500">Check back later for new episodes</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {filteredShows.map((show: TMDBTVShow) => (
        <TVShowCard key={show.id} show={show} />
      ))}
    </div>
  );
};

export default TVShowList;
