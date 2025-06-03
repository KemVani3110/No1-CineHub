'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies, fetchTVShows, getImageUrl } from '@/services/tmdb';
import { TMDBMovie, TMDBTVShow } from '@/types/tmdb';
import { motion, AnimatePresence } from 'framer-motion';

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

  if (!currentItem || !items?.length) {
    return (
      <div className="relative w-full h-[70vh] overflow-hidden rounded-2xl mb-16 bg-[#0D1B2A] animate-pulse" />
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
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-2xl mb-16">
      {/* Background Image with Overlay */}
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
            opacity: { duration: 0.2 }
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
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/90 to-[#0D1B2A]/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-end">
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Tab Buttons */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab('movies');
              setCurrentIndex(0);
            }}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeTab === 'movies'
                ? 'bg-[#4FD1C5] text-white'
                : 'bg-black/30 text-white hover:bg-black/50'
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
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeTab === 'tv'
                ? 'bg-[#4FD1C5] text-white'
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
          >
            TV Shows
          </motion.button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-8 md:p-12"
          >
            <div className="max-w-4xl">
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {activeTab === 'movies' ? (currentItem as TMDBMovie).title : (currentItem as TMDBTVShow).name}
                </h1>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-8 line-clamp-2 drop-shadow-lg">
                  {activeTab === 'movies' ? (currentItem as TMDBMovie).overview : (currentItem as TMDBTVShow).overview}
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <button
                  onClick={() => router.push(`/${activeTab}/${currentItem.id}`)}
                  className="flex items-center gap-2 bg-[#4FD1C5] hover:bg-[#4FD1C5]/90 text-white px-6 py-3 rounded-full transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Now</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_: unknown, index: number) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-[#4FD1C5] w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 