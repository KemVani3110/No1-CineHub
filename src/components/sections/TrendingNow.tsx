 'use client';

import { Star } from 'lucide-react';

const trendingMovies = [
  { id: 4, title: "Avatar 2", rating: 8.2, poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=200&h=300&fit=crop" },
  { id: 5, title: "Top Gun", rating: 8.7, poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=300&fit=crop" },
  { id: 6, title: "Spider-Man", rating: 8.4, poster: "https://images.unsplash.com/photo-1489599904381-b6f38d6ee133?w=200&h=300&fit=crop" },
  { id: 7, title: "Batman", rating: 8.1, poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=300&fit=crop" }
];

const TrendingNow = () => {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>Trending Now</h3>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {trendingMovies.map((movie) => (
          <div 
            key={movie.id}
            className="flex-shrink-0 w-40 group cursor-pointer"
          >
            <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-105">
              <img 
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-semibold text-sm mb-1" style={{ fontFamily: 'Inter' }}>{movie.title}</h4>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" style={{ color: '#F4B400' }} />
              <span className="text-sm font-medium">{movie.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingNow;