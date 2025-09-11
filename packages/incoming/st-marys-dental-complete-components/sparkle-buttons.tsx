// components/effects/sparkle-buttons.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SparkleButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  sparkleColor?: string;
  onClick?: () => void;
}

export const SparkleButton: React.FC<SparkleButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  sparkleColor = '#D4AF37',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-600 to-teal-600 text-white',
    secondary: 'bg-gradient-to-r from-teal-600 to-pink-600 text-white',
    outline: 'border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    generateSparkles();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSparkles([]);
  };

  const generateSparkles = () => {
    const newSparkles = [];
    for (let i = 0; i < 8; i++) {
      newSparkles.push({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }
    setSparkles(newSparkles);
  };

  return (
    <motion.button
      className={`relative overflow-hidden rounded-full font-semibold transition-all duration-300 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Sparkle Effects */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            backgroundColor: sparkleColor,
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            boxShadow: `0 0 6px ${sparkleColor}`
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 0], 
            opacity: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Button Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Magnetic Button Effect
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  magnetStrength?: number;
}> = ({ children, className = '', magnetStrength = 0.3 }) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * magnetStrength;
    const deltaY = (e.clientY - centerY) * magnetStrength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.button>
  );
};

// Liquid Button Effect
export const LiquidButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className = '', color = '#C2185B' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`relative overflow-hidden rounded-full px-8 py-4 font-semibold text-white ${className}`}
      style={{ backgroundColor: color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          rotate: isHovered ? [0, 180, 360] : 0,
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: 'easeInOut'
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

