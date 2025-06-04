import { TMDBMovieDetails } from "@/types/tmdb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Building2, Calendar, Globe, Clock, Star, Users } from "lucide-react";

interface MovieOverviewProps {
  movie: TMDBMovieDetails;
}

export default function MovieOverview({ movie }: MovieOverviewProps) {
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
            {movie.overview}
          </p>
        </CardContent>
      </Card>

      {/* Movie Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rating Card */}
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3 fill-current" />
            <div className="text-3xl font-bold text-white mb-1">
              {movie.vote_average.toFixed(1)}
            </div>
            <div className="text-slate-300 text-sm">
              Rating ({movie.vote_count.toLocaleString()} votes)
            </div>
          </CardContent>
        </Card>

        {/* Runtime Card */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {movie.runtime ? Math.floor(movie.runtime / 60) : 0}h{" "}
              {movie.runtime ? movie.runtime % 60 : 0}m
            </div>
            <div className="text-slate-300 text-sm">Duration</div>
          </CardContent>
        </Card>

        {/* Release Date Card */}
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {new Date(movie.release_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="text-slate-300 text-sm">Release Date</div>
          </CardContent>
        </Card>

        {/* Language Card */}
        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <div className="text-xl font-bold text-white mb-1">
              {movie.spoken_languages?.[0]?.english_name || 'English'}
            </div>
            <div className="text-slate-300 text-sm">Primary Language</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Movie Details */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              Movie Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 font-medium">Status</span>
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  {movie.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 font-medium">Original Title</span>
                <span className="text-white font-medium text-right max-w-[200px] truncate">
                  {movie.original_title}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 font-medium">Original Language</span>
                <span className="text-white font-medium">
                  {movie.spoken_languages.find(
                    (lang) => lang.iso_639_1 === movie.original_language
                  )?.english_name || 'Unknown'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 font-medium">Genres</span>
                <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                  {movie.genres.slice(0, 3).map((genre) => (
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

              {movie.tagline && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">Tagline</span>
                  <span className="text-slate-300 italic text-right max-w-[200px]">
                    "{movie.tagline}"
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Financial & Production */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-400" />
              Production & Finance
            </h3>
            <div className="space-y-4">
              {movie.budget > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget
                  </span>
                  <span className="text-green-400 font-bold">
                    ${movie.budget.toLocaleString()}
                  </span>
                </div>
              )}

              {movie.revenue > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Revenue
                  </span>
                  <span className="text-green-400 font-bold">
                    ${movie.revenue.toLocaleString()}
                  </span>
                </div>
              )}

              {movie.budget > 0 && movie.revenue > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Profit</span>
                  <span className={`font-bold ${
                    movie.revenue - movie.budget > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${(movie.revenue - movie.budget).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <h4 className="text-white font-semibold">Production Companies</h4>
                {movie.production_companies.slice(0, 4).map((company) => (
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

              {movie.production_countries.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-700/50">
                  <h4 className="text-white font-semibold">Production Countries</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_countries.map((country) => (
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