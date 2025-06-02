'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Calendar, Play } from 'lucide-react';
import { getImageUrl } from '@/services/tmdb';

interface MovieCardProps {
  movie: {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
  };
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  return (
    <div className="movie-card group relative overflow-hidden rounded-xl bg-[#1B263B] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#4FD1C5]/20 cursor-pointer">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={getImageUrl(movie.poster_path)}
          alt={title || 'Movie poster'}
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
          <h3 className="text-lg font-semibold text-white line-clamp-2">{title}</h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-300">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{year}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-[#4FD1C5]/20 px-2 py-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 