"use client";

import { TMDBEpisode } from "@/types/tmdb";
import { format } from "date-fns";
import { Calendar, Clock, Star, Play } from "lucide-react";
import { getImageUrl } from "@/services/tmdb";
import { useRouter } from "next/navigation";

interface EpisodesListProps {
  episodes: TMDBEpisode[];
  showId: number;
  seasonNumber: number;
  currentEpisodeNumber?: number;
}

export function EpisodesList({ episodes, showId, seasonNumber, currentEpisodeNumber }: EpisodesListProps) {
  const router = useRouter();

  const handleEpisodeClick = (episodeNumber: number) => {
    router.push(`/watch-tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`);
  };

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {episodes.map((episode) => (
        <div
          key={episode.id}
          className={`flex gap-2 sm:gap-4 p-2 sm:p-4 bg-[#0d1b2a] rounded-lg hover:bg-[#1b263b] transition-all duration-300 group cursor-pointer ${
            currentEpisodeNumber === episode.episode_number ? "ring-2 ring-[#4fd1c5]" : ""
          }`}
          onClick={() => handleEpisodeClick(episode.episode_number)}
        >
          {/* Episode Thumbnail */}
          <div className="relative w-20 sm:w-32 h-14 sm:h-20 flex-shrink-0">
            <img
              src={getImageUrl(episode.still_path || null, "w500")}
              alt={episode.name}
              className="w-full h-full object-cover rounded shadow-md"
            />
            {/* Mobile Play Button - Always Visible */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center sm:hidden">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#4fd1c5] rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 text-[#0d1b2a]" fill="currentColor" />
              </div>
            </div>
            {/* Desktop Play Button - Only on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Episode Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-1 sm:gap-2 mb-1 sm:mb-2">
              <h5 className="font-medium text-[#e0e6ed] text-xs sm:text-base truncate">
                {episode.episode_number}. {episode.name}
              </h5>
              {episode.vote_average > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span className="text-[#9aafc3] text-[10px] sm:text-sm">
                    {episode.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-[10px] sm:text-sm text-[#9aafc3] mb-1 sm:mb-2 flex items-center gap-1 sm:gap-4">
              {episode.air_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-2 h-2 sm:w-4 sm:h-4" />
                  {format(new Date(episode.air_date), 'MMM d, yyyy')}
                </span>
              )}
              {episode.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-2 h-2 sm:w-4 sm:h-4" />
                  {episode.runtime} min
                </span>
              )}
            </div>
            
            {episode.overview && (
              <p className="text-[10px] sm:text-sm text-[#9aafc3] line-clamp-2 sm:line-clamp-3">
                {episode.overview}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 