'use client';

import { Star, Play, Heart } from 'lucide-react';

const featuredMovies = [
  {
    id: 1,
    title: "The Dark Knight",
    year: "2008",
    rating: 9.0,
    genre: "Action",
    backdrop: "https://images.unsplash.com/photo-1489599904381-b6f38d6ee133?w=800&h=400&fit=crop"
  }
];

const HeroSection = () => {
  return (
    <section className="mb-12">
      <div className="relative rounded-lg overflow-hidden h-96 md:h-[500px]" style={{ backgroundColor: '#1B263B' }}>
        <img 
          src={featuredMovies[0].backdrop}
          alt="Featured Movie"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent">
          <div className="absolute bottom-8 left-8 max-w-lg">
            <h2 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Poppins' }}>
              {featuredMovies[0].title}
            </h2>
            <p className="text-lg mb-4" style={{ color: '#9AAFC3' }}>
              Epic action thriller that redefined superhero cinema. A masterpiece of storytelling and visual effects.
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-current" style={{ color: '#F4B400' }} />
                <span className="font-semibold">{featuredMovies[0].rating}</span>
              </div>
              <span style={{ color: '#9AAFC3' }}>{featuredMovies[0].year}</span>
              <span className="px-2 py-1 rounded text-sm" style={{ backgroundColor: '#4FD1C5', color: '#0D1B2A' }}>
                {featuredMovies[0].genre}
              </span>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90" style={{ backgroundColor: '#4FD1C5', color: '#0D1B2A' }}>
                <Play className="w-5 h-5" />
                <span>Watch Now</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 rounded-lg border font-semibold transition-colors hover:bg-opacity-20" style={{ borderColor: '#2E3C51', backgroundColor: 'rgba(79, 209, 197, 0.1)' }}>
                <Heart className="w-5 h-5" />
                <span>Add to List</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 