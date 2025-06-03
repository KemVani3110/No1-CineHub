'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TMDBSeason, TMDBSeasonDetails, TMDBEpisode } from '@/types/tmdb';
import { getImageUrl, fetchSeasonDetails } from '@/services/tmdb';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Loading from '@/components/common/Loading';

interface TVShowSeasonsProps {
  seasons: TMDBSeason[];
  tvShowId: number;
}

const TVShowSeasons = ({ seasons, tvShowId }: TVShowSeasonsProps) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [isEpisodesExpanded, setIsEpisodesExpanded] = useState(false);

  const { data: seasonDetails, isLoading } = useQuery({
    queryKey: ['season', tvShowId, selectedSeason],
    queryFn: () => fetchSeasonDetails(tvShowId, selectedSeason),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Seasons</h2>
      
      {/* Season Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {seasons.map((season) => (
          <button
            key={season.id}
            onClick={() => {
              setSelectedSeason(season.season_number);
              setIsEpisodesExpanded(false);
            }}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedSeason === season.season_number
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary/10 hover:bg-primary/20'
            }`}
          >
            {season.name}
          </button>
        ))}
      </div>

      {/* Season Details */}
      <div className="bg-card rounded-lg p-6">
        {isLoading ? (
          <Loading message="Loading season details..." />
        ) : seasonDetails ? (
          <div className="space-y-6">
            {/* Season Header */}
            <div className="flex gap-6">
              <div className="relative w-48 h-72">
                <Image
                  src={getImageUrl(seasonDetails.poster_path || null)}
                  alt={seasonDetails.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold">{seasonDetails.name}</h3>
                  <p className="text-text-sub">
                    {seasonDetails.episodes.length} Episodes
                  </p>
                </div>
                {seasonDetails.overview && (
                  <div>
                    <h4 className="font-semibold mb-2">Overview</h4>
                    <p className="text-text-sub">{seasonDetails.overview}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Air Date</p>
                    <p className="text-text-sub">
                      {seasonDetails.air_date
                        ? new Date(seasonDetails.air_date).toLocaleDateString()
                        : 'TBA'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Average Rating</p>
                    <p className="text-text-sub">
                      {seasonDetails.vote_average.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Episodes List Toggle */}
            <button
              onClick={() => setIsEpisodesExpanded(!isEpisodesExpanded)}
              className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors"
            >
              Episodes
              {isEpisodesExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {/* Episodes List */}
            {isEpisodesExpanded && (
              <div className="space-y-4 pt-4 border-t border-border">
                {seasonDetails.episodes.map((episode: TMDBEpisode) => (
                  <div
                    key={episode.id}
                    className="flex gap-4 p-4 bg-background rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <div className="relative w-48 h-27">
                      <Image
                        src={getImageUrl(episode.still_path || null)}
                        alt={episode.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold">
                          {episode.episode_number}. {episode.name}
                        </h5>
                        {episode.vote_average > 0 && (
                          <span className="text-sm text-text-sub">
                            • {episode.vote_average.toFixed(1)} Rating
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-text-sub mb-2">
                        {episode.air_date && (
                          <span className="mr-2">
                            {new Date(episode.air_date).toLocaleDateString()}
                          </span>
                        )}
                        {episode.runtime && (
                          <span>{episode.runtime} min</span>
                        )}
                      </div>
                      <p className="text-text-sub line-clamp-3">
                        {episode.overview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-sub">No season details available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShowSeasons; 