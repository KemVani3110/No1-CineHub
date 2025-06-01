'use client';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

const GenreFilter = ({ genres, selectedGenre, onGenreSelect }: GenreFilterProps) => {
  return (
    <section className="mb-8">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onGenreSelect(genre)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedGenre === genre 
                ? 'text-white' 
                : 'hover:bg-opacity-20'
            }`}
            style={{
              backgroundColor: selectedGenre === genre ? '#4FD1C5' : 'rgba(79, 209, 197, 0.1)',
              color: selectedGenre === genre ? '#0D1B2A' : '#E0E6ED'
            }}
          >
            {genre}
          </button>
        ))}
      </div>
    </section>
  );
};

export default GenreFilter; 