/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState } from 'react';
import { TrendingUp, Clock, Award, Settings, Tv, Film } from 'lucide-react';
import { 
  Header, 
  Footer, 
  HeroSection, 
  PopularMovies,
  TopRatedMovies,
  NowPlayingMovies,
  UpcomingMovies,
  PopularTVShows,
  TopRatedTVShows,
  OnTheAirTVShows,
  withLazyLoading 
} from '@/components/lazy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Wrap components with lazy loading
const LazyHeader = withLazyLoading(Header);
const LazyFooter = withLazyLoading(Footer);
const LazyHeroSection = withLazyLoading(HeroSection);
const LazyPopularMovies = withLazyLoading(PopularMovies);
const LazyTopRatedMovies = withLazyLoading(TopRatedMovies);
const LazyNowPlayingMovies = withLazyLoading(NowPlayingMovies);
const LazyUpcomingMovies = withLazyLoading(UpcomingMovies);
const LazyPopularTVShows = withLazyLoading(PopularTVShows);
const LazyTopRatedTVShows = withLazyLoading(TopRatedTVShows);
const LazyOnTheAirTVShows = withLazyLoading(OnTheAirTVShows);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode; icon: React.ElementType }) => (
  <div className="flex items-center gap-3 mb-8">
    <Icon className="w-8 h-8 text-[#4FD1C5]" />
    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4FD1C5] to-[#63B3ED] bg-clip-text text-transparent" style={{ fontFamily: 'Poppins' }}>
      {children}
    </h2>
  </div>
);

const ToggleButton = ({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
      active 
        ? 'bg-[#4FD1C5] text-white shadow-lg shadow-[#4FD1C5]/20' 
        : 'bg-[#1B263B] text-gray-400 hover:bg-[#2D3748]'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'movies' | 'tv'>('movies');

  return (
    <QueryClientProvider client={queryClient}>
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
          {/* <LazyHeroSection /> */}
          
          {/* Section Toggle */}
          <div className="flex gap-4 mb-12">
            <ToggleButton
              active={activeSection === 'movies'}
              onClick={() => setActiveSection('movies')}
              icon={Film}
              label="Movies"
            />
            <ToggleButton
              active={activeSection === 'tv'}
              onClick={() => setActiveSection('tv')}
              icon={Tv}
              label="TV Shows"
            />
          </div>

          {/* Movies Section */}
          {activeSection === 'movies' && (
            <div className="mb-16">
              <SectionTitle icon={Film}>Popular Movies</SectionTitle>
              <LazyPopularMovies />

              <SectionTitle icon={Film}>Top Rated Movies</SectionTitle>
              <LazyTopRatedMovies />

              <SectionTitle icon={Film}>Now Playing</SectionTitle>
              <LazyNowPlayingMovies />

              <SectionTitle icon={Film}>Upcoming Movies</SectionTitle>
              <LazyUpcomingMovies />
            </div>
          )}

          {/* TV Shows Section */}
          {activeSection === 'tv' && (
            <div className="mb-16">
              <SectionTitle icon={Tv}>Popular TV Shows</SectionTitle>
              <LazyPopularTVShows />

              <SectionTitle icon={Tv}>Top Rated TV Shows</SectionTitle>
              <LazyTopRatedTVShows />

              <SectionTitle icon={Tv}>On The Air</SectionTitle>
              <LazyOnTheAirTVShows />
            </div>
          )}
        </main>

        <LazyFooter />
      </div>
    </QueryClientProvider>
  );
} 