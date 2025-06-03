'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Clock, Play, Calendar, Film } from 'lucide-react';
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
    runtime?: number;
  };
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const rating = movie.vote_average;

  return (
    <div className="group relative cursor-pointer h-full">
      {/* Main Card Container với fixed height */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B263B] via-[#1E2A47] to-[#0F1419] shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#4FD1C5]/20 h-full flex flex-col border border-[#2A3441]/50">
        
        {/* Poster Image Container - Tăng tỷ lệ */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl">
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={title || 'Movie poster'}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            sizes="(max-width: 768px) 60vw, (max-width: 1200px) 40vw, 30vw"
          />
          
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#4FD1C5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top badges container */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Quality Badge với animation */}
            <div className="transform transition-all duration-300 group-hover:scale-110">
              <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] text-white rounded-full shadow-lg backdrop-blur-sm border border-[#4FD1C5]/30">
                <Film className="w-3 h-3 mr-1" />
                4K
              </span>
            </div>

            {/* Rating Badge */}
            {rating > 0 && (
              <div className="transform transition-all duration-300 group-hover:scale-110">
                <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-full px-3 py-1.5 border border-yellow-400/30">
                  <Star className="w-3 h-3 text-yellow-400 fill-current drop-shadow-sm" />
                  <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Play Button Overlay với enhanced animation */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-sm">
            <button className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] text-white shadow-2xl transition-all duration-500 hover:scale-125 hover:rotate-3 hover:shadow-[#4FD1C5]/50 border-4 border-white/20">
              <Play className="w-8 h-8 ml-1 drop-shadow-lg" fill="currentColor" />
            </button>
          </div>

          {/* Enhanced gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1B263B] via-[#1B263B]/80 to-transparent" />
          
          {/* Subtle border glow */}
          <div className="absolute inset-0 rounded-t-3xl border border-[#4FD1C5]/0 group-hover:border-[#4FD1C5]/30 transition-all duration-500" />
        </div>

        {/* Content Section với fixed height - Tăng padding */}
        <div className="p-6 flex-1 flex flex-col justify-between min-h-[140px]">
          {/* Title với fixed height để đồng đều */}
          <div className="mb-3 flex-1">
            <h3 
              className="text-white font-bold text-lg leading-tight mb-3 transition-colors duration-300 group-hover:text-[#4FD1C5]" 
              style={{ 
                fontFamily: 'Poppins',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '3rem' // Tăng chiều cao tối thiểu
              }}
              title={title}
            >
              {title}
            </h3>
          </div>
          
          {/* Bottom info section - Tăng size */}
          <div className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-5 h-5 text-[#4FD1C5]" />
              <span className="font-medium">{year}</span>
            </div>
            
            {movie.runtime && (
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5 text-[#4FD1C5]" />
                <span className="font-medium">{movie.runtime}m</span>
              </div>
            )}
          </div>

          {/* Decorative bottom border */}
          <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#4FD1C5]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </div>
      </div>

      {/* Subtle outer glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#4FD1C5]/0 to-[#4FD1C5]/0 group-hover:from-[#4FD1C5]/10 group-hover:to-[#38B2AC]/10 transition-all duration-500 -z-10 blur-xl" />
    </div>
  );
};