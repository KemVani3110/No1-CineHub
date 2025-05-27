/* eslint-disable @next/next/no-img-element */
//Test màu 
"use client"

import React, { useState } from 'react';
import { Star, Play, Heart, Search, Menu, User, Settings, TrendingUp, Clock, Award } from 'lucide-react';

export default function CineHubMainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'];
  
  const featuredMovies = [
    {
      id: 1,
      title: "The Dark Knight",
      year: "2008",
      rating: 9.0,
      genre: "Action",
      poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
      backdrop: "https://images.unsplash.com/photo-1489599904381-b6f38d6ee133?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Inception",
      year: "2010", 
      rating: 8.8,
      genre: "Sci-Fi",
      poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
      backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Interstellar",
      year: "2014",
      rating: 8.6,
      genre: "Drama",
      poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop",
      backdrop: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop"
    }
  ];

  const trendingMovies = [
    { id: 4, title: "Avatar 2", rating: 8.2, poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=200&h=300&fit=crop" },
    { id: 5, title: "Top Gun", rating: 8.7, poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=300&fit=crop" },
    { id: 6, title: "Spider-Man", rating: 8.4, poster: "https://images.unsplash.com/photo-1489599904381-b6f38d6ee133?w=200&h=300&fit=crop" },
    { id: 7, title: "Batman", rating: 8.1, poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=300&fit=crop" }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1B2A', color: '#E0E6ED' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: '#1B263B', borderColor: '#2E3C51' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-opacity-20"
              style={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins', color: '#4FD1C5' }}>CineHub</h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#9AAFC3' }} />
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: '#1B263B', 
                  borderColor: '#2E3C51',
                  color: '#E0E6ED'
                }}
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-opacity-20" style={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}>
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed left-0 top-0 h-full w-64 p-4" style={{ backgroundColor: '#1B263B' }}>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Poppins' }}>Menu</h2>
              <nav className="space-y-2">
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-20" style={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}>
                  <TrendingUp className="w-5 h-5" />
                  <span>Trending</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-20" style={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}>
                  <Clock className="w-5 h-5" />
                  <span>My Watchlist</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-20" style={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}>
                  <Award className="w-5 h-5" />
                  <span>Top Rated</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-20" style={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}>
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
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

        {/* Genre Filter */}
        <section className="mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
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

        {/* Featured Movies Grid */}
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

        {/* Trending Now */}
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

        {/* Color Palette Test */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>Color Palette Test</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#0D1B2A' }}>
              <div className="text-sm font-medium mb-1">BG Main</div>
              <div className="text-xs" style={{ color: '#9AAFC3' }}>#0D1B2A</div>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#1B263B' }}>
              <div className="text-sm font-medium mb-1">BG Card</div>
              <div className="text-xs" style={{ color: '#9AAFC3' }}>#1B263B</div>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#4FD1C5', color: '#0D1B2A' }}>
              <div className="text-sm font-medium mb-1">Accent</div>
              <div className="text-xs">#4FD1C5</div>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#38B2AC', color: '#0D1B2A' }}>
              <div className="text-sm font-medium mb-1">Accent Hover</div>
              <div className="text-xs">#38B2AC</div>
            </div>
          </div>
        </section>

        {/* Status Colors Test */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>Status Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#1B263B', borderColor: '#2ECC71' }}>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2ECC71' }}></div>
                <span className="font-semibold" style={{ color: '#2ECC71' }}>Success</span>
              </div>
              <p className="text-sm" style={{ color: '#9AAFC3' }}>Movie added to watchlist successfully</p>
            </div>
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#1B263B', borderColor: '#F4B400' }}>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F4B400' }}></div>
                <span className="font-semibold" style={{ color: '#F4B400' }}>Warning</span>
              </div>
              <p className="text-sm" style={{ color: '#9AAFC3' }}>Premium subscription required</p>
            </div>
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#1B263B', borderColor: '#EF5350' }}>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF5350' }}></div>
                <span className="font-semibold" style={{ color: '#EF5350' }}>Error</span>
              </div>
              <p className="text-sm" style={{ color: '#9AAFC3' }}>Failed to load movie details</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}