'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Play, Star, Tv } from 'lucide-react';
import { format } from 'date-fns';
import { getImageUrl } from '@/services/tmdb';
import { TMDBTVShow } from '@/types/tmdb';

interface TVShowCardProps {
  show: TMDBTVShow;
}

export const TVShowCard = ({ show }: TVShowCardProps) => {
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