'use client';

import { TMDBVideos } from '@/types/tmdb';
import { Play } from 'lucide-react';

interface TVShowMediaProps {
  videos: TMDBVideos;
}

const TVShowMedia = ({ videos }: TVShowMediaProps) => {
  const trailers = videos.results.filter(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  if (!trailers.length) {
    return (
      <div className="text-center py-8">
        <p className="text-text-sub">No trailers available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trailers.map((trailer) => (
          <div
            key={trailer.id}
            className="relative aspect-video bg-card rounded-lg overflow-hidden group cursor-pointer"
            onClick={() =>
              window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')
            }
          >
            <img
              src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
              alt={trailer.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                <Play className="w-8 h-8" />
                <span className="font-medium">Play Trailer</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-medium text-white">{trailer.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TVShowMedia; 