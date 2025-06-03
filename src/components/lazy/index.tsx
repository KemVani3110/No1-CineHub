"use client";

import React, { lazy, Suspense } from "react";
import Loading from "@/components/common/Loading";

// Common components
export const Header = lazy(() => import("@/components/common/Header"));
export const Footer = lazy(() => import("@/components/common/Footer"));

// Auth components
export const LoginForm = lazy(() => import("@/components/auth/LoginForm"));
export const RegisterForm = lazy(
  () => import("@/components/auth/RegisterForm")
);
export const SocialLoginButtons = lazy(
  () => import("@/components/auth/SocialLoginButtons")
);

// Section components
export const HeroSection = lazy(
  () => import("@/components/sections/HeroSection")
);
export const PopularMovies = lazy(
  () => import("@/components/sections/PopularMovies")
);
export const TopRatedMovies = lazy(
  () => import("@/components/sections/TopRatedMovies")
);
export const NowPlayingMovies = lazy(
  () => import("@/components/sections/NowPlayingMovies")
);
export const UpcomingMovies = lazy(
  () => import("@/components/sections/UpcomingMovies")
);

// TV Show components
export const PopularTVShows = lazy(
  () => import("@/components/sections/PopularTVShows")
);
export const TopRatedTVShows = lazy(
  () => import("@/components/sections/TopRatedTVShows")
);

// Featured Movies
export const FeaturedMovies = lazy(
  () => import("@/components/sections/FeaturedMovies")
);

export const LazyUpcomingTVShows = lazy(
  () => import("@/components/sections/UpcomingTVShows")
);

// Lazy loading wrapper component
export const withLazyLoading = (Component: React.ComponentType) => {
  return function LazyLoadedComponent(props: any) {
    return (
      <Suspense fallback={<Loading message="Loading..." />}>
        <Component {...props} />
      </Suspense>
    );
  };
};
