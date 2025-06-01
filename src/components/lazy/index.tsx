'use client';

import React, { lazy, Suspense } from 'react';
import Loading from '@/components/common/Loading';

// Common components
export const Header = lazy(() => import('@/components/common/Header'));
export const Footer = lazy(() => import('@/components/common/Footer'));

// Auth components
export const LoginForm = lazy(() => import('@/components/auth/LoginForm'));
export const RegisterForm = lazy(() => import('@/components/auth/RegisterForm'));
export const SocialLoginButtons = lazy(() => import('@/components/auth/SocialLoginButtons'));

// Section components
export const HeroSection = lazy(() => import('@/components/sections/HeroSection'));
export const GenreFilter = lazy(() => import('@/components/sections/GenreFilter'));
export const FeaturedMovies = lazy(() => import('@/components/sections/FeaturedMovies'));
export const TrendingNow = lazy(() => import('@/components/sections/TrendingNow'));
// export const MovieCard = lazy(() => import('@/components/movies/MovieCard'));
// export const MovieGrid = lazy(() => import('@/components/movies/MovieGrid'));
// export const MovieDetails = lazy(() => import('@/components/movies/MovieDetails'));

// UI components
// export const Modal = lazy(() => import('@/components/ui/modal'));
// export const Carousel = lazy(() => import('@/components/ui/carousel'));
// export const ImageGallery = lazy(() => import('@/components/ui/image-gallery'));

// Lazy loading wrapper component
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
}; 