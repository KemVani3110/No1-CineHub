'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TMDBTV } from '@/types/tmdb';
import { getImageUrl } from '@/services/tmdb';
import { Star } from 'lucide-react';

interface SimilarTVShowsProps {
  similarShows: TMDBTV[];
}

const SimilarTVShows = ({ similarShows }: SimilarTVShowsProps) => {
  if (!similarShows.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Similar TV Shows</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {similarShows.slice(0, 10).map((show) => (
          <Link
            key={show.id}
            href={`/tv/${show.id}`}
            className="group space-y-2"
          >
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={getImageUrl(show.poster_path || null)}
                alt={show.name}
                fill
                className="object-cover rounded-lg transition-transform group-hover:scale-105"
              />
            </div>
            <div>
              <h3 className="font-semibold line-clamp-1">{show.name}</h3>
              <div className="flex items-center gap-2 text-sm text-text-sub">
                <span>{new Date(show.first_air_date).getFullYear()}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{show.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarTVShows; 