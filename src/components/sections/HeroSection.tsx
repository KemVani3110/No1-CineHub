'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, ChevronLeft, ChevronRight, Star, Clock, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies, fetchTVShows, getImageUrl, fetchGenres } from '@/services/tmdb';
import { TMDBMovie, TMDBTVShow, TMDBGenre } from '@/types/tmdb';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_ITEMS = 10;

const HeroSection = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');
  const [direction, setDirection] = useState(0);

  const { data: moviesData } = useQuery({
    queryKey: ['movies', 'now_playing'],
    queryFn: () => fetchMovies('now_playing', 1),
  });

  const { data: tvData } = useQuery({
    queryKey: ['tv', 'on_the_air'],
    queryFn: () => fetchTVShows('on_the_air', 1),
  });

  const { data: movieGenres } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: () => fetchGenres('movie'),
  });

  const { data: tvGenres } = useQuery({
    queryKey: ['tvGenres'],
    queryFn: () => fetchGenres('tv'),
  });

  const items = activeTab === 'movies' 
    ? moviesData?.results?.slice(0, MAX_ITEMS) 
    : tvData?.results?.slice(0, MAX_ITEMS);
  
  const currentItem = items?.[currentIndex];

  useEffect(() => {
    if (!items?.length) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items?.length]);

  const nextSlide = () => {
    if (!items?.length) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    if (!items?.length) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const getGenreNames = (genreIds: number[]) => {
    const genres = activeTab === 'movies' ? movieGenres : tvGenres;
    return genreIds?.slice(0, 2)
      .map(id => genres?.find((genre: TMDBGenre) => genre.id === id)?.name)
      .filter(Boolean) || [];
  };

  if (!currentItem || !items?.length) {
    return (
      <div className="relative w-full h-[60vh] overflow-hidden rounded-2xl mb-12">
        <div className="absolute inset-0 bg-[#1B263B]">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main/90 via-bg-main/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-main/70 via-transparent to-bg-main/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-main/60" />
        
        {/* Navigation Buttons Skeleton */}
        <div className="absolute top-6 left-6 flex gap-3 z-20">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>

        {/* Tab Buttons Skeleton */}
        <div className="absolute top-6 right-6 flex gap-3 z-20">
          <Skeleton className="w-20 h-10 rounded-full" />
          <Skeleton className="w-20 h-10 rounded-full" />
        </div>

        {/* Content Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-3xl">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex gap-4 mb-4">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <Skeleton className="h-20 w-full mb-6" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative w-full h-[60vh] overflow-hidden rounded-2xl mb-12 shadow-2xl">
      {/* Background Image with Enhanced Overlay */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 }
          }}
          className="absolute inset-0"
        >
          <Image
            src={getImageUrl(currentItem.backdrop_path, 'original')}
            alt={activeTab === 'movies' ? (currentItem as TMDBMovie).title : (currentItem as TMDBTVShow).name}
            fill
            className="object-cover"
            priority
          />
          {/* Enhanced Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main/90 via-bg-main/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-main/70 via-transparent to-bg-main/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-main/60" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - Moved to top left */}
      <div className="absolute top-6 left-6 flex gap-3 z-20">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(79, 209, 197, 0.2)" }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="bg-bg-card/30 backdrop-blur-sm border border-border hover:border-cinehub-accent text-white p-2 rounded-full transition-all duration-300 hover:shadow-lg"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(79, 209, 197, 0.2)" }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="bg-bg-card/30 backdrop-blur-sm border border-border hover:border-cinehub-accent text-white p-2 rounded-full transition-all duration-300 hover:shadow-lg"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Tab Buttons - Moved to top right */}
      <div className="absolute top-6 right-6 flex gap-3 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveTab('movies');
            setCurrentIndex(0);
          }}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 backdrop-blur-sm ${
            activeTab === 'movies'
              ? 'bg-cinehub-accent text-bg-main shadow-lg'
              : 'bg-bg-card/30 border border-border text-text-main hover:bg-bg-card/50 hover:border-cinehub-accent'
          }`}
        >
          Movies
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveTab('tv');
            setCurrentIndex(0);
          }}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 backdrop-blur-sm ${
            activeTab === 'tv'
              ? 'bg-cinehub-accent text-bg-main shadow-lg'
              : 'bg-bg-card/30 border border-border text-text-main hover:bg-bg-card/50 hover:border-cinehub-accent'
          }`}
        >
          TV Shows
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-end">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full p-6 md:p-8"
          >
            <div className="max-w-3xl">
              {/* Title */}
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl md:text-5xl font-bold text-text-main mb-3 leading-tight">
                  {activeTab === 'movies' ? (currentItem as TMDBMovie).title : (currentItem as TMDBTVShow).name}
                </h1>
              </motion.div>

              {/* Metadata Row */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
                {/* Rating */}
                <div className="flex items-center gap-2 bg-bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="text-text-main font-semibold text-base">
                    {currentItem.vote_average.toFixed(1)}
                  </span>
                </div>

                {/* Release Date */}
                <div className="flex items-center gap-2 bg-bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
                  <Calendar className="w-4 h-4 text-cinehub-accent" />
                  <span className="text-text-main font-medium text-sm">
                    {formatDate(activeTab === 'movies' ? (currentItem as TMDBMovie).release_date : (currentItem as TMDBTVShow).first_air_date)}
                  </span>
                </div>

                {/* Runtime placeholder */}
                <div className="flex items-center gap-2 bg-bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
                  <Clock className="w-4 h-4 text-text-sub" />
                  <span className="text-text-main font-medium text-sm">
                    {activeTab === 'movies' ? '120 min' : 'TV Series'}
                  </span>
                </div>
              </motion.div>

              {/* Genres */}
              <motion.div variants={itemVariants} className="flex gap-2 mb-4">
                {getGenreNames(currentItem.genre_ids).map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-bg-card/30 backdrop-blur-sm border border-border rounded-full text-text-main font-medium text-xs hover:border-cinehub-accent transition-colors duration-300"
                  >
                    {genre}
                  </span>
                ))}
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                <p className="text-text-sub text-sm md:text-base max-w-2xl mb-6 leading-relaxed line-clamp-3">
                  {activeTab === 'movies' ? (currentItem as TMDBMovie).overview : (currentItem as TMDBTVShow).overview}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/${activeTab}/${currentItem.id}`)}
                  className="flex items-center gap-2 bg-cinehub-accent hover:bg-cinehub-accent-hover text-bg-main px-6 py-2.5 rounded-full font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Watch Now</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-bg-card/50 backdrop-blur-sm border-2 border-border hover:border-cinehub-accent text-text-main px-6 py-2.5 rounded-full font-semibold text-base transition-all duration-300"
                >
                  <span>More Info</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {items.map((_: unknown, index: number) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-8 h-2 bg-cinehub-accent shadow-lg' 
                : 'w-2 h-2 bg-text-sub hover:bg-text-main'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bg-card/30 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-cinehub-accent to-cinehub-accent-hover shadow-lg"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "linear", repeat: Infinity }}
          key={currentIndex}
        />
      </div>
    </div>
  );
};

export default HeroSection;