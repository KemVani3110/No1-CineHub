import { TMDBVideos } from "@/types/tmdb";
import { Play } from "lucide-react";

interface MovieMediaProps {
  videos: TMDBVideos;
}

export default function MovieMedia({ videos }: MovieMediaProps) {
  const trailers = videos.results.filter(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  if (!trailers.length) {
    return (
      <div className="text-center py-8">
        <p className="text-text-sub">No trailers available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {trailers.map((trailer) => (
        <div
          key={trailer.id}
          className="relative aspect-video rounded-lg overflow-hidden"
        >
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={trailer.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ))}
    </div>
  );
}
