// components/hero/luxury-hero-video.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LuxuryHeroVideoProps {
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
}

export const LuxuryHeroVideo: React.FC<LuxuryHeroVideoProps> = ({
  className = '',
  autoPlay = true,
  muted = true,
  loop = true,
  poster = '/images/hero-poster.jpg'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay) {
        video.play().catch(console.error);
      }
    };

    const handleError = () => {
      setHasError(true);
      console.warn('Hero video failed to load, showing fallback');
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [autoPlay]);

  // Fallback gradient background if video fails
  if (hasError) {
    return (
      <div className={`relative w-full h-screen overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-teal-500">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center text-white"
          >
            <h1 className="text-6xl font-bold mb-4">St Mary's House</h1>
            <p className="text-2xl">Luxury Coastal Dentistry</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        poster={poster}
      >
        {/* Multiple video sources for better compatibility */}
        <source src="/videos/hero-4k.mp4" type="video/mp4" />
        <source src="/videos/hero-4k.webm" type="video/webm" />
        <source src="/videos/hero-fallback.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-teal-500 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-center"
          >
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xl">Loading Luxury Experience...</p>
          </motion.div>
        </div>
      )}

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center text-white px-4"
        >
          <motion.h1 
            className="text-7xl font-bold mb-6 bg-gradient-to-r from-white via-pink-200 to-teal-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
            transition={{ duration: 1, delay: 1 }}
          >
            St Mary's House
          </motion.h1>
          <motion.p 
            className="text-3xl mb-8 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            Luxury Coastal Dentistry
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 1, delay: 2 }}
            className="space-x-4"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-semibold hover:scale-105 transition-transform">
              Book Consultation
            </button>
            <button className="px-8 py-4 border-2 border-white rounded-full text-white font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Virtual Tour
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  );
};

