import { TMDBMovieDetails } from "@/types/tmdb";

interface MovieOverviewProps {
  movie: TMDBMovieDetails;
}

export function MovieOverview({ movie }: MovieOverviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Overview</h3>
        <p className="text-text-sub leading-relaxed">{movie.overview}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Details</h3>
          <div className="space-y-3">
            <div>
              <span className="text-text-sub">Status</span>
              <p className="text-text-main">{movie.status}</p>
            </div>
            <div>
              <span className="text-text-sub">Original Language</span>
              <p className="text-text-main">
                {
                  movie.spoken_languages.find(
                    (lang) => lang.iso_639_1 === movie.original_language
                  )?.english_name
                }
              </p>
            </div>
            <div>
              <span className="text-text-sub">Budget</span>
              <p className="text-text-main">
                {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-text-sub">Revenue</span>
              <p className="text-text-main">
                {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Production</h3>
          <div className="space-y-3">
            {movie.production_companies.map((company) => (
              <div key={company.id}>
                <span className="text-text-sub">{company.name}</span>
                {company.origin_country && (
                  <p className="text-text-main">({company.origin_country})</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
