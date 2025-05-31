'use client';

import React, { lazy, Suspense } from 'react';
import Loading from '@/components/common/Loading';

// Common components
export const Header = lazy(() => import('@/components/common/Header'));
export const Footer = lazy(() => import('@/components/common/Footer'));

// Section components
export const HeroSection = lazy(() => import('@/components/sections/HeroSection'));
export const GenreFilter = lazy(() => import('@/components/sections/GenreFilter'));
export const FeaturedMovies = lazy(() => import('@/components/sections/FeaturedMovies'));
export const TrendingNow = lazy(() => import('@/components/sections/TrendingNow'));

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