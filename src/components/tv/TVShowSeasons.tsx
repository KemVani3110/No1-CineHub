'use client';

import { TMDBTVDetails, TMDBEpisode } from '@/types/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Clock, Star, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { getImageUrl, fetchSeasonDetails } from '@/services/tmdb';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TVShowSeasonsProps {
  tvShow: TMDBTVDetails;
}

const TVShowSeasons = ({ tvShow }: TVShowSeasonsProps) => {
  const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(new Set());

  const toggleSeasonExpansion = (seasonNumber: number) => {
    const newExpanded = new Set(expandedSeasons);
    if (newExpanded.has(seasonNumber)) {
      newExpanded.delete(seasonNumber);
    } else {
      newExpanded.add(seasonNumber);
    }
    setExpandedSeasons(newExpanded);
  };

  const handlePlayEpisode = (episode: TMDBEpisode, seasonNumber: number) => {
    console.log(`Playing Season ${seasonNumber}, Episode ${episode.episode_number}: ${episode.name}`);
  };

  const { data: seasonDetails, isLoading } = useQuery({
    queryKey: ['season', tvShow.id, Array.from(expandedSeasons)],
    queryFn: async () => {
      const seasonDetailsMap = new Map();
      for (const seasonNumber of expandedSeasons) {
        const details = await fetchSeasonDetails(tvShow.id, seasonNumber);
        seasonDetailsMap.set(seasonNumber, details);
      }
      return seasonDetailsMap;
    },
    enabled: expandedSeasons.size > 0,
  });

  if (!tvShow.seasons?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-[#9aafc3]">No seasons available yet.</p>
      </div>
    );
  }

  const totalEpisodes = tvShow.seasons.reduce((total, season) => total + (season.episode_count || 0), 0);

  return (
    <div className="space-y-4">
      {/* Season Summary Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-[#9aafc3] text-sm mb-4 gap-2 sm:gap-0">
        <span>Total seasons: {tvShow.seasons.length}</span>
        <span>Total episodes: {totalEpisodes}</span>
      </div>

      {/* Seasons List */}
      <div className="space-y-4 sm:space-y-6">
        {tvShow.seasons.map((season) => (
          <Card key={season.id} className="bg-[#1b263b] border-[#2e3c51] hover:border-[#4fd1c5] transition-all duration-300">
            <CardContent className="p-0">
              {/* Season Header - Clickable */}
              <div 
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 cursor-pointer hover:bg-[#2e3c51]/50 transition-colors rounded-t-lg"
                onClick={() => toggleSeasonExpansion(season.season_number)}
              >
                {/* Season Poster */}
                <div className="relative w-full sm:w-28 h-40 sm:h-48 flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={getImageUrl(season.poster_path || null, "w500")}
                    alt={season.name}
                    className="w-full h-full object-cover rounded-md shadow-lg"
                  />
                </div>
                
                {/* Season Info */}
                <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#e0e6ed] truncate">
                      {season.name}
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <Badge variant="secondary" className="bg-[#2e3c51] text-[#9aafc3] text-xs sm:text-sm px-2 sm:px-3 py-1">
                        {season.episode_count} episodes
                      </Badge>
                      {expandedSeasons.has(season.season_number) ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#4fd1c5]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-[#4fd1c5]" />
                      )}
                    </div>
                  </div>
                  
                  {season.overview && (
                    <p className="text-[#9aafc3] text-sm sm:text-base line-clamp-2">
                      {season.overview}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 sm:gap-5 text-sm sm:text-base text-[#9aafc3]">
                    {season.air_date && (
                      <span className="flex items-center gap-1 sm:gap-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        {format(new Date(season.air_date), 'yyyy')}
                      </span>
                    )}
                    {season.vote_average > 0 && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                        <span>{season.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Episodes List - Expandable */}
              {expandedSeasons.has(season.season_number) && (
                <div className="border-t border-[#2e3c51] p-4 sm:p-6">
                  {isLoading || !seasonDetails?.has(season.season_number) ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="w-32 h-20 rounded" />
                          <div className="flex-1 space-y-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-12 w-full" />
                          </div>
                          <Skeleton className="w-12 h-12 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ScrollArea className="w-full">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {seasonDetails.get(season.season_number)?.episodes.map((episode: TMDBEpisode) => (
                          <div
                            key={episode.id}
                            className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-[#0d1b2a] rounded-lg hover:bg-[#1b263b] transition-all duration-300 group cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayEpisode(episode, season.season_number);
                            }}
                          >
                            {/* Episode Thumbnail */}
                            <div className="relative w-24 sm:w-32 h-16 sm:h-20 flex-shrink-0">
                              <img
                                src={getImageUrl(episode.still_path || null, "w500")}
                                alt={episode.name}
                                className="w-full h-full object-cover rounded shadow-md"
                              />
                              {/* Mobile Play Button - Always Visible */}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center sm:hidden">
                                <div className="w-8 h-8 bg-[#4fd1c5] rounded-full flex items-center justify-center shadow-lg">
                                  <Play className="w-4 h-4 text-[#0d1b2a]" fill="currentColor" />
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
                                <h5 className="font-medium text-[#e0e6ed] text-sm sm:text-base truncate">
                                  {episode.episode_number}. {episode.name}
                                </h5>
                                {episode.vote_average > 0 && (
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                                    <span className="text-[#9aafc3] text-xs sm:text-sm">
                                      {episode.vote_average.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-xs sm:text-sm text-[#9aafc3] mb-1 sm:mb-2 flex items-center gap-2 sm:gap-4">
                                {episode.air_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {format(new Date(episode.air_date), 'MMM d, yyyy')}
                                  </span>
                                )}
                                {episode.runtime && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {episode.runtime} min
                                  </span>
                                )}
                              </div>
                              
                              {episode.overview && (
                                <p className="text-[#9aafc3] text-xs sm:text-sm line-clamp-2">
                                  {episode.overview}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="mt-2" />
                    </ScrollArea>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

function SeasonDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Skeleton className="w-32 h-48 rounded-lg" />
        <div className="flex-1 space-y-3">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div>
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </div>
      <Skeleton className="h-6 w-20" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-32 h-18 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TVShowSeasons;