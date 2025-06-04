'use client';

import { TMDBTVDetails, TMDBPerson } from '@/types/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Camera, Award, Star, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/services/tmdb';
import { useState } from 'react';

interface TVShowCastProps {
  tvShow: TMDBTVDetails;
}

interface CastMember extends TMDBPerson {
  character?: string;
  episode_count?: number;
}

export default function TVShowCast({ tvShow }: TVShowCastProps) {
  const [showAllCast, setShowAllCast] = useState(false);
  const cast = (tvShow.credits?.cast || []) as CastMember[];
  const displayCast = showAllCast ? cast : cast.slice(0, 12);

  if (!cast.length) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No cast information available.</p>
      </div>
    );
  }

  const CastCard = ({ person }: { person: CastMember }) => (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl bg-slate-800">
        {/* Profile Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={
              person.profile_path
                ? getImageUrl(person.profile_path, "w500")
                : "/images/no-profile.jpg"
            }
            alt={person.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Info */}
        <div className="p-4">
          <h4 className="font-semibold text-white text-sm leading-tight mb-1 group-hover:text-blue-400 transition-colors">
            {person.name}
          </h4>
          <p className="text-slate-400 text-xs leading-tight line-clamp-2">
            {person.character || 'Unknown Character'}
          </p>
          {person.popularity && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-slate-500">
                {person.popularity.toFixed(1)}
              </span>
            </div>
          )}
          {person.episode_count && (
            <div className="flex items-center gap-1 mt-1">
              <Award className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-slate-500">
                {person.episode_count} Episodes
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Cast Section */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="w-7 h-7 text-blue-400" />
              Main Cast
              <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">
                {cast.length}
              </Badge>
            </h3>
            {cast.length > 12 && (
              <Button
                variant="ghost"
                onClick={() => setShowAllCast(!showAllCast)}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
              >
                {showAllCast ? 'Show Less' : 'Show All'}
                <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAllCast ? 'rotate-90' : ''}`} />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {displayCast.map((person) => (
              <CastCard key={person.id} person={person} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 