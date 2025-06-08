/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Clock,
  Award,
  Settings,
  Tv,
  Film,
  Star,
  PlayCircle,
  Calendar,
} from "lucide-react";
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
  UpcomingTVShows,
  withLazyLoading
} from "@/components/lazy";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import BackToTop from "@/components/common/BackToTop";
import Loading from "@/components/common/Loading";

// Wrap components with lazy loading
const LazyHeader = withLazyLoading(Header, "Loading header...");
const LazyFooter = withLazyLoading(Footer, "Loading footer...");
const LazyHeroSection = withLazyLoading(HeroSection, "Loading hero section...");
const LazyPopularMovies = withLazyLoading(PopularMovies, "Loading popular movies...");
const LazyTopRatedMovies = withLazyLoading(TopRatedMovies, "Loading top rated movies...");
const LazyNowPlayingMovies = withLazyLoading(NowPlayingMovies, "Loading now playing movies...");
const LazyUpcomingMovies = withLazyLoading(UpcomingMovies, "Loading upcoming movies...");
const LazyPopularTVShows = withLazyLoading(PopularTVShows, "Loading popular TV shows...");
const LazyTopRatedTVShows = withLazyLoading(TopRatedTVShows, "Loading top rated TV shows...");
const LazyUpcomingTVShows = withLazyLoading(UpcomingTVShows, "Loading upcoming TV shows...");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const SectionTitle = ({
  children,
  icon: Icon,
  subtitle,
}: {
  children: React.ReactNode;
  icon: React.ElementType;
  subtitle?: string;
}) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4FD1C5]/10">
        <Icon className="w-6 h-6 text-[#4FD1C5]" />
      </div>
      <div>
        <h2 className="section-title">
          {children}
        </h2>
        {subtitle && <p className="subheading text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
    <div className="h-1 w-16 bg-gradient-to-r from-[#4FD1C5] to-[#63B3ED] rounded-full" />
  </div>
);

const ToggleButton = ({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  count?: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-[#4FD1C5] to-[#63B3ED] text-white shadow-lg shadow-[#4FD1C5]/20"
        : "bg-[#1B263B] text-gray-400 hover:bg-[#2D3748] hover:text-white border border-[#2D3748]"
    }`}
  >
    <Icon className="w-5 h-5" />
    <div className="text-left">
      <span className="font-semibold text-base">{label}</span>
      {count && <div className="text-xs opacity-80">{count}</div>}
    </div>
  </button>
);

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"movies" | "tv">("movies");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="min-h-screen"
        style={{ backgroundColor: "#0D1B2A", color: "#E0E6ED" }}
      >
        <LazyHeader
          onSidebarChange={(open: boolean) => setIsSidebarOpen(open)}
        />

        {/* Mobile Sidebar */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMenuOpen(false)}
            ></div>
            <div
              className="fixed left-0 top-0 h-full w-64 p-4"
              style={{ backgroundColor: "#1B263B" }}
            >
              <div className="space-y-4">
                <h2 className="section-title text-xl mb-6">
                  Menu
                </h2>
                <nav className="space-y-2">
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-20"
                    style={{ backgroundColor: "rgba(79, 209, 197, 0.1)" }}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Trending</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-20"
                    style={{ backgroundColor: "rgba(79, 209, 197, 0.1)" }}
                  >
                    <Clock className="w-5 h-5" />
                    <span>My Watchlist</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-20"
                    style={{ backgroundColor: "rgba(79, 209, 197, 0.1)" }}
                  >
                    <Award className="w-5 h-5" />
                    <span>Top Rated</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-20"
                    style={{ backgroundColor: "rgba(79, 209, 197, 0.1)" }}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main
          className={`transition-all duration-300 ${
            isSidebarOpen ? "ml-70" : ""
          }`}
        >
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <LazyHeroSection />

            {/* Section Toggle */}
            <div className="flex gap-4 mb-12 justify-center">
              <ToggleButton
                active={activeSection === "movies"}
                onClick={() => setActiveSection("movies")}
                icon={Film}
                label="Movies"
                count="Latest releases"
              />
              <ToggleButton
                active={activeSection === "tv"}
                onClick={() => setActiveSection("tv")}
                icon={Tv}
                label="TV Shows"
                count="Trending series"
              />
            </div>

            {/* Movies Section */}
            {activeSection === "movies" && (
              <div className="space-y-12">
                <section>
                  <SectionTitle
                    icon={TrendingUp}
                    subtitle="Discover what everyone's watching right now"
                  >
                    Trending Movies
                  </SectionTitle>
                  <React.Suspense fallback={<Loading message="Loading trending movies..." />}>
                    <LazyPopularMovies />
                  </React.Suspense>
                </section>

                <section>
                  <SectionTitle
                    icon={Star}
                    subtitle="Critically acclaimed and audience favorites"
                  >
                    Top Rated Movies
                  </SectionTitle>
                  <React.Suspense fallback={<Loading message="Loading top rated movies..." />}>
                    <LazyTopRatedMovies />
                  </React.Suspense>
                </section>

                <section>
                  <SectionTitle
                    icon={PlayCircle}
                    subtitle="Currently playing in theaters"
                  >
                    Now Playing
                  </SectionTitle>
                  <React.Suspense fallback={<Loading message="Loading now playing movies..." />}>
                    <LazyNowPlayingMovies />
                  </React.Suspense>
                </section>

                <section>
                  <SectionTitle
                    icon={Calendar}
                    subtitle="Coming soon to theaters"
                  >
                    Upcoming Releases
                  </SectionTitle>
                  <React.Suspense fallback={<Loading message="Loading upcoming movies..." />}>
                    <LazyUpcomingMovies />
                  </React.Suspense>
                </section>
              </div>
            )}

            {/* TV Shows Section */}
            {activeSection === "tv" && (
              <div className="space-y-12">
                <section>
                  <SectionTitle
                    icon={TrendingUp}
                    subtitle="Discover what everyone's watching right now"
                  >
                    Trending TV Shows
                  </SectionTitle>
                  <React.Suspense fallback={<Loading message="Loading trending TV shows..." />}>
                    <LazyPopularTVShows />
                  </React.Suspense>
                </section>

                <section>
                  <SectionTitle
                    icon={Star}
                    subtitle="Critically acclaimed and audience favorites"
                  >
                    Top Rated TV Shows
                  </SectionTitle>
                  <React.Suspense fallback={<Loading message="Loading top rated TV shows..." />}>
                    <LazyTopRatedTVShows />
                  </React.Suspense>
                </section>

                <section>
                  <SectionTitle
                    icon={Calendar}
                    subtitle="Coming soon to your screens"
                  >
                    Upcoming TV Shows
                  </SectionTitle>
                  <React.Suspense fallback={<Loading message="Loading upcoming TV shows..." />}>
                    <LazyUpcomingTVShows />
                  </React.Suspense>
                </section>
              </div>
            )}
          </div>
        </main>

        <LazyFooter isSidebarOpen={isSidebarOpen} />
        <BackToTop />
      </div>
    </QueryClientProvider>
  );
}
