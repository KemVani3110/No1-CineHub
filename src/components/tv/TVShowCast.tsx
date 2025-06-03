'use client';

import Image from 'next/image';
import { TMDBCredits } from '@/types/tmdb';
import { getImageUrl } from '@/services/tmdb';

interface TVShowCastProps {
  credits: TMDBCredits;
}

const TVShowCast = ({ credits }: TVShowCastProps) => {
  const mainCast = credits.cast.slice(0, 10); // Show only first 10 cast members

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {mainCast.map((person) => (
          <div key={person.credit_id} className="space-y-2">
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={getImageUrl(person.profile_path || null)}
                alt={person.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="font-semibold">{person.name}</h3>
              <p className="text-sm text-text-sub">{person.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TVShowCast; 