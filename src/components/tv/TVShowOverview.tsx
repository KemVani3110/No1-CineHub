'use client';

import { TMDBTVDetails } from '@/types/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Globe, Star, Users, Tv } from 'lucide-react';

interface TVShowOverviewProps {
  tvShow: TMDBTVDetails;
}

export default function TVShowOverview({ tvShow }: TVShowOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Synopsis */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Synopsis
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed">
            {tvShow.overview}
          </p>
        </CardContent>
      </Card>

      {/* TV Show Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rating Card */}
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3 fill-current" />
            <div className="text-3xl font-bold text-white mb-1">
              {tvShow.vote_average.toFixed(1)}
            </div>
            <div className="text-slate-300 text-sm">
              Rating ({tvShow.vote_count.toLocaleString()} votes)
            </div>
          </CardContent>
        </Card>

        {/* Episodes Card */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
          <CardContent className="p-6 text-center">
            <Tv className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {tvShow.number_of_episodes}
            </div>
            <div className="text-slate-300 text-sm">Total Episodes</div>
          </CardContent>
        </Card>

        {/* Seasons Card */}
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {tvShow.number_of_seasons}
            </div>
            <div className="text-slate-300 text-sm">Total Seasons</div>
          </CardContent>
        </Card>

        {/* Language Card */}
        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <div className="text-xl font-bold text-white mb-1">
              {tvShow.spoken_languages?.[0]?.english_name || 'English'}
            </div>
            <div className="text-slate-300 text-sm">Primary Language</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TV Show Details */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              Show Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 font-medium">Status</span>
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  {tvShow.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 font-medium">Original Title</span>
                <span className="text-white font-medium text-right max-w-[200px] truncate">
                  {tvShow.original_name}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 font-medium">Original Language</span>
                <span className="text-white font-medium">
                  {tvShow.spoken_languages.find(
                    (lang) => lang.iso_639_1 === tvShow.original_language
                  )?.english_name || 'Unknown'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 font-medium">Genres</span>
                <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                  {tvShow.genres.slice(0, 3).map((genre) => (
                    <Badge
                      key={genre.id}
                      variant="secondary"
                      className="bg-slate-700 text-slate-200 text-xs"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {tvShow.tagline && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">Tagline</span>
                  <span className="text-slate-300 italic text-right max-w-[200px]">
                    "{tvShow.tagline}"
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Networks & Production */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Tv className="w-6 h-6 text-blue-400" />
              Networks & Production
            </h3>
            <div className="space-y-4">
              {tvShow.networks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Networks</h4>
                  {tvShow.networks.map((network) => (
                    <div key={network.id} className="flex justify-between items-center py-1">
                      <span className="text-slate-300 text-sm">{network.name}</span>
                      {network.origin_country && (
                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                          {network.origin_country}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tvShow.production_companies.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-700/50">
                  <h4 className="text-white font-semibold">Production Companies</h4>
                  {tvShow.production_companies.slice(0, 4).map((company) => (
                    <div key={company.id} className="flex justify-between items-center py-1">
                      <span className="text-slate-300 text-sm">{company.name}</span>
                      {company.origin_country && (
                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                          {company.origin_country}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tvShow.production_countries.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-700/50">
                  <h4 className="text-white font-semibold">Production Countries</h4>
                  <div className="flex flex-wrap gap-2">
                    {tvShow.production_countries.map((country) => (
                      <Badge
                        key={country.iso_3166_1}
                        variant="secondary"
                        className="bg-slate-700 text-slate-200"
                      >
                        {country.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 