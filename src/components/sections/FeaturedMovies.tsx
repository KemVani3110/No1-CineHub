'use client';

import { Star, Play } from 'lucide-react';

const featuredMovies = [
  {
    id: 1,
    title: "The Dark Knight",
    year: "2008",
    rating: 9.0,
    genre: "Action",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop"
  },
  {
    id: 2,
    title: "Inception",
    year: "2010", 
    rating: 8.8,
    genre: "Sci-Fi",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop"
  },
  {
    id: 3,
    title: "Interstellar",
    year: "2014",
    rating: 8.6,
    genre: "Drama",
    poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop"
  }
];

const FeaturedMovies = () => {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>Featured Movies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredMovies.map((movie) => (
          <div 
            key={movie.id}
            className="group rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{ backgroundColor: '#1B263B' }}
          >
            <div className="aspect-[2/3] relative">
              <img 
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12" style={{ color: '#4FD1C5' }} />
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'Poppins' }}>{movie.title}</h4>
              <div className="flex items-center justify-between">
                <span style={{ color: '#9AAFC3' }}>{movie.year}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current" style={{ color: '#F4B400' }} />
                  <span className="font-semibold">{movie.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedMovies; 