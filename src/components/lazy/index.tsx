"use client";

import React, { lazy, Suspense } from "react";
import Loading from "@/components/common/Loading";

// Common components
export const Header = lazy(() => import("@/components/common/Header"));
export const Footer = lazy(() => import("@/components/common/Footer"));
export const MovieCard = lazy(() => import("@/components/common/MovieCard").then(mod => ({ default: mod.MovieCard })));
export const TVShowCard = lazy(() => import("@/components/common/TVShowCard").then(mod => ({ default: mod.TVShowCard })));

// Auth components
export const LoginForm = lazy(() => import("@/components/auth/LoginForm"));
export const RegisterForm = lazy(() => import("@/components/auth/RegisterForm"));
export const SocialLoginButtons = lazy(() => import("@/components/auth/SocialLoginButtons"));

// UI components
export const Dialog = lazy(() => import("@/components/ui/dialog").then(mod => ({ default: mod.Dialog })));
export const DropdownMenu = lazy(() => import("@/components/ui/dropdown-menu").then(mod => ({ default: mod.DropdownMenu })));
export const Sheet = lazy(() => import("@/components/ui/sheet").then(mod => ({ default: mod.Sheet })));
export const Tabs = lazy(() => import("@/components/ui/tabs").then(mod => ({ default: mod.Tabs })));
export const Select = lazy(() => import("@/components/ui/select").then(mod => ({ default: mod.Select })));
export const Form = lazy(() => import("@/components/ui/form").then(mod => ({ default: mod.Form })));
export const ScrollArea = lazy(() => import("@/components/ui/scroll-area").then(mod => ({ default: mod.ScrollArea })));

// Section components
export const HeroSection = lazy(() => import("@/components/sections/HeroSection"));
export const PopularMovies = lazy(() => import("@/components/sections/PopularMovies"));
export const TopRatedMovies = lazy(() => import("@/components/sections/TopRatedMovies"));
export const NowPlayingMovies = lazy(() => import("@/components/sections/NowPlayingMovies"));
export const UpcomingMovies = lazy(() => import("@/components/sections/UpcomingMovies"));
export const PopularTVShows = lazy(() => import("@/components/sections/PopularTVShows"));
export const TopRatedTVShows = lazy(() => import("@/components/sections/TopRatedTVShows"));
export const UpcomingTVShows = lazy(() => import("@/components/sections/UpcomingTVShows"));

// TV Show components
export const TVShowOverview = lazy(() => import("@/components/tv/TVShowOverview"));
export const TVShowCast = lazy(() => import("@/components/tv/TVShowCast"));
export const TVShowSeasons = lazy(() => import("@/components/tv/TVShowSeasons"));
export const TVShowMedia = lazy(() => import("@/components/tv/TVShowMedia"));
export const SimilarTVShows = lazy(() => import("@/components/tv/SimilarTVShows"));

// Movie components
export const MovieOverview = lazy(() => import("@/components/movie/MovieOverview"));
export const MovieCast = lazy(() => import("@/components/movie/MovieCast"));
export const MovieMedia = lazy(() => import("@/components/movie/MovieMedia"));
export const SimilarMovies = lazy(() => import("@/components/movie/SimilarMovies"));

// Lazy loading wrapper component with custom loading messages
export const withLazyLoading = (Component: React.ComponentType, loadingMessage?: string) => {
  return function LazyLoadedComponent(props: any) {
    return (
      <Suspense fallback={<Loading message={loadingMessage || "Loading..."} />}>
        <Component {...props} />
      </Suspense>
    );
  };
};
