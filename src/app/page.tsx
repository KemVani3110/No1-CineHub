/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState } from 'react';
import { TrendingUp, Clock, Award, Settings } from 'lucide-react';
import { 
  Header, 
  Footer, 
  HeroSection, 
  GenreFilter, 
  FeaturedMovies, 
  TrendingNow,
  withLazyLoading 
} from '@/components/lazy';

// Wrap components with lazy loading
const LazyHeader = withLazyLoading(Header);
const LazyFooter = withLazyLoading(Footer);
const LazyHeroSection = withLazyLoading(HeroSection);
const LazyGenreFilter = withLazyLoading(GenreFilter);
const LazyFeaturedMovies = withLazyLoading(FeaturedMovies);
const LazyTrendingNow = withLazyLoading(TrendingNow);

export default function CineHubMainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1B2A', color: '#E0E6ED' }}>
      <LazyHeader />

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
        <LazyHeroSection />
        <LazyGenreFilter 
          genres={genres} 
          selectedGenre={selectedGenre} 
          onGenreChange={setSelectedGenre} 
        />
        <LazyFeaturedMovies />
        <LazyTrendingNow />
      </main>

      <LazyFooter />
    </div>
  );
}