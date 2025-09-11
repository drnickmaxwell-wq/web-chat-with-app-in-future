// components/effects/floating-sparkles.tsx
'use client';

import React, { useEffect, useRef } from 'react';

interface FloatingSparklesProps {
  sparkleCount?: number;
  colors?: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FloatingSparkles: React.FC<FloatingSparklesProps> = ({
  sparkleCount = 25,
  colors = ['#D4AF37', '#FFD700', '#C2185B', '#40C4B4'],
  size = 'md',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sparkles: HTMLDivElement[] = [];
    const sizeMap = { sm: 4, md: 6, lg: 8 };
    const sparkleSize = sizeMap[size];

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'absolute pointer-events-none';
      sparkle.style.width = `${sparkleSize}px`;
      sparkle.style.height = `${sparkleSize}px`;
      sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.borderRadius = '50%';
      sparkle.style.boxShadow = `0 0 ${sparkleSize * 2}px currentColor`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animation = `sparkleFloat ${3 + Math.random() * 4}s ease-in-out infinite`;
      sparkle.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(sparkle);
      sparkles.push(sparkle);
    }

    return () => {
      sparkles.forEach(sparkle => sparkle.remove());
    };
  }, [sparkleCount, colors, size]);

  return (
    <>
      <style jsx>{`
        @keyframes sparkleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
      `}</style>
      <div ref={containerRef} className={`pointer-events-none ${className}`} />
    </>
  );
};

