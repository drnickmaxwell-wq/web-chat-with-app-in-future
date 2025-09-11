// components/effects/webgl-wave-effects.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WebGLWaveEffectsProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  speed?: 'slow' | 'medium' | 'fast';
  colors?: string[];
  interactive?: boolean;
}

export const WebGLWaveEffects: React.FC<WebGLWaveEffectsProps> = ({
  className = '',
  intensity = 'medium',
  speed = 'medium',
  colors = ['#C2185B', '#40C4B4', '#D4AF37'],
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const waves: Array<{
      amplitude: number;
      frequency: number;
      phase: number;
      color: string;
      opacity: number;
    }> = [];

    // Create multiple wave layers
    colors.forEach((color, index) => {
      waves.push({
        amplitude: 50 + index * 20,
        frequency: 0.01 + index * 0.005,
        phase: index * Math.PI / 3,
        color: color,
        opacity: 0.3 - index * 0.05
      });
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height / 2 + 
            Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 2 + time * 1.5 + wave.phase) * wave.amplitude * 0.5;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, wave.color + '40');
        gradient.addColorStop(1, wave.color + '10');
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      time += speed === 'fast' ? 0.05 : speed === 'medium' ? 0.03 : 0.01;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    setIsLoaded(true);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (interactive) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity, speed, colors, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }}
    />
  );
};

