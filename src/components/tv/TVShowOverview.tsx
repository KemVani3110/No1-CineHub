'use client';

import Image from 'next/image';
import { TMDBTVDetails } from '@/types/tmdb';
import { getImageUrl } from '@/services/tmdb';
import { Star } from 'lucide-react';

interface TVShowOverviewProps {
  tvShow: TMDBTVDetails;
}

const TVShowOverview = ({ tvShow }: TVShowOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full max-w-sm mx-auto">
        <Image
          src={getImageUrl(tvShow.poster_path || null)}
          alt={tvShow.name}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      {/* Info */}
      <div className="md:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{tvShow.name}</h1>
          <div className="flex items-center gap-4 text-text-sub">
            <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
            <span>•</span>
            <span>{tvShow.number_of_seasons} Seasons</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{tvShow.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-text-sub leading-relaxed">{tvShow.overview}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {tvShow.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-primary/10 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <div className="grid grid-cols-2 gap-4 text-text-sub">
            <div>
              <p className="font-medium">Status</p>
              <p>{tvShow.status}</p>
            </div>
            <div>
              <p className="font-medium">Original Language</p>
              <p>{tvShow.original_language.toUpperCase()}</p>
            </div>
            <div>
              <p className="font-medium">Type</p>
              <p>{tvShow.type}</p>
            </div>
            <div>
              <p className="font-medium">Network</p>
              <p>{tvShow.networks[0]?.name || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowOverview; 