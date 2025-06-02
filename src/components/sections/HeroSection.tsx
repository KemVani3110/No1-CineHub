'use client';

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-2xl mb-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end p-8 md:p-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to CineHub
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-8">
            Discover and watch your favorite movies and TV shows in one place.
          </p>
          <button
            onClick={() => router.push('/movies')}
            className="flex items-center gap-2 bg-[#4FD1C5] hover:bg-[#4FD1C5]/90 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            <span>Explore Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 