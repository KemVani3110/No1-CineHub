"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTVShows, getImageUrl } from "@/services/tmdb";
import { TMDBTVShow } from "@/types/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Star, Calendar, Play, Tv } from "lucide-react";
import Link from "next/link";

interface TVShowListProps {
  listType: "popular" | "top_rated" | "on_the_air";
  title?: string;
}

const TVShowCard = ({ show }: { show: TMDBTVShow }) => {
  const year = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : "";

  return (
    <Link href={`/tv/${show.id}`}>
      <div className="group relative cursor-pointer h-full">
        {/* Main Card Container với fixed height */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B263B] via-[#1E2A47] to-[#0F1419] shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#4FD1C5]/20 h-full flex flex-col border border-[#2A3441]/50">
          {/* Poster Image Container - Tăng tỷ lệ */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl">
            <Image
              src={getImageUrl(show.poster_path)}
              alt={show.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              sizes="(max-width: 768px) 60vw, (max-width: 1200px) 40vw, 30vw"
            />

            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#4FD1C5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top badges container */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              {/* Quality Badge */}
              <div className="transform transition-all duration-300 group-hover:scale-110">
                <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] text-white rounded-full shadow-lg backdrop-blur-sm border border-[#4FD1C5]/30">
                  <Tv className="w-3 h-3 mr-1" />
                  HD
                </span>
              </div>

              {/* TV Show Badge */}
              <div className="transform transition-all duration-300 group-hover:scale-110">
                <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-md rounded-full px-3 py-1.5 border border-purple-400/30">
                  <span className="text-xs font-bold text-white">SERIES</span>
                </div>
              </div>
            </div>

            {/* Rating Badge */}
            {show.vote_average > 0 && (
              <div className="absolute top-14 right-3 transform transition-all duration-300 group-hover:scale-110">
                <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-full px-3 py-1.5 border border-yellow-400/30">
                  <Star className="w-3 h-3 text-yellow-400 fill-current drop-shadow-sm" />
                  <span className="text-xs font-bold text-white">
                    {show.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-sm">
              <button className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] text-white shadow-2xl transition-all duration-500 hover:scale-125 hover:rotate-3 hover:shadow-[#4FD1C5]/50 border-4 border-white/20">
                <Play
                  className="w-8 h-8 ml-1 drop-shadow-lg"
                  fill="currentColor"
                />
              </button>
            </div>

            {/* Enhanced gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1B263B] via-[#1B263B]/80 to-transparent" />

            {/* Subtle border glow */}
            <div className="absolute inset-0 rounded-t-3xl border border-[#4FD1C5]/0 group-hover:border-[#4FD1C5]/30 transition-all duration-500" />
          </div>

          {/* Content Section với fixed height - Tăng padding */}
          <div className="p-6 flex-1 flex flex-col justify-between min-h-[140px]">
            {/* Title với fixed height */}
            <div className="mb-3 flex-1">
              <h3
                className="text-white font-bold text-lg leading-tight mb-3 transition-colors duration-300 group-hover:text-[#4FD1C5]"
                style={{
                  fontFamily: "Poppins",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: "3rem",
                }}
                title={show.name}
              >
                {show.name}
              </h3>
            </div>

            {/* Bottom info section - Tăng size */}
            <div className="flex items-center justify-between text-base gap-2">
              <div className="flex items-center gap-2 text-gray-300 flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#4FD1C5]" />
                <span className="font-medium">{year}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Shortened text to prevent overflow */}
                <span className="text-purple-400 font-bold text-xs bg-purple-500/20 px-2 py-1 rounded-full border border-purple-400/30 whitespace-nowrap">
                  TV
                </span>
              </div>
            </div>

            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#4FD1C5]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </div>
        </div>

        {/* Subtle outer glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#4FD1C5]/0 to-[#4FD1C5]/0 group-hover:from-[#4FD1C5]/10 group-hover:to-[#38B2AC]/10 transition-all duration-500 -z-10 blur-xl" />
      </div>
    </Link>
  );
};

const TVShowList = ({ listType, title }: TVShowListProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tvShows", listType],
    queryFn: () => getTVShows(listType),
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
          <div className="text-red-500 text-xl mb-2">
            Error loading TV shows
          </div>
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {data.results.map((show: TMDBTVShow) => (
        <TVShowCard key={show.id} show={show} />
      ))}
    </div>
  );
};

export default TVShowList;
