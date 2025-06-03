import { TMDBCredits } from "@/types/tmdb";
import Image from "next/image";
import { getImageUrl } from "@/services/tmdb";

interface MovieCastProps {
  credits: TMDBCredits;
}

export default function MovieCast({ credits }: MovieCastProps) {
  const cast = credits.cast.slice(0, 10);
  const crew = credits.crew.filter((person) =>
    ["Director", "Producer", "Screenplay"].includes(person.job)
  );

  return (
    <div className="space-y-8">
      {/* Cast */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Cast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cast.map((person) => (
            <div key={person.id} className="text-center">
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-2">
                <Image
                  src={
                    person.profile_path
                      ? getImageUrl(person.profile_path)
                      : "/images/no-profile.jpg"
                  }
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-medium text-text-main">{person.name}</h4>
              <p className="text-sm text-text-sub">{person.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Crew */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Crew</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crew.map((person) => (
            <div key={person.credit_id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={
                    person.profile_path
                      ? getImageUrl(person.profile_path)
                      : "/images/no-profile.jpg"
                  }
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-text-main">{person.name}</h4>
                <p className="text-sm text-text-sub">{person.job}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
