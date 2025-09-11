// components/effects/morphing-geometry.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const MorphingGeometry: React.FC<{
  className?: string;
  shapes?: number;
}> = ({ className = '', shapes = 5 }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: shapes }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 20}%`,
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
          }}
          animate={{
            borderRadius: [
              '30% 70% 70% 30% / 30% 30% 70% 70%',
              '70% 30% 30% 70% / 70% 70% 30% 30%',
              '50% 50% 50% 50% / 50% 50% 50% 50%',
              '30% 70% 70% 30% / 30% 30% 70% 70%'
            ],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5
          }}
          style={{
            background: `linear-gradient(45deg, 
              rgba(194, 24, 91, ${0.1 - i * 0.01}), 
              rgba(64, 196, 180, ${0.08 - i * 0.01}), 
              rgba(212, 175, 55, ${0.06 - i * 0.01}))`,
          }}
        />
      ))}
    </div>
  );
};

// components/effects/particle-constellation.tsx
export const ParticleConstellation: React.FC<{
  className?: string;
  particleCount?: number;
}> = ({ className = '', particleCount = 50 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      connections: number[];
    }> = [];

    const colors = ['#C2185B', '#40C4B4', '#D4AF37'];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: []
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.globalAlpha = (150 - distance) / 150 * 0.3;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(particle => {
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

// components/effects/text-morphing-animation.tsx
export const TextMorphingAnimation: React.FC<{
  texts: string[];
  className?: string;
  interval?: number;
}> = ({ texts, className = '', interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className={`relative ${className}`}>
      {texts.map((text, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 0.8,
            rotateX: index === currentIndex ? 0 : -90,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
        >
          <span className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-teal-600 to-yellow-500 bg-clip-text text-transparent">
            {text}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// components/effects/liquid-morphing-shapes.tsx
export const LiquidMorphingShapes: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Large liquid shape */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 opacity-10"
        animate={{
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '30% 60% 70% 40% / 50% 60% 30% 60%',
            '40% 60% 60% 40% / 60% 40% 60% 40%',
            '60% 40% 30% 70% / 60% 30% 70% 40%'
          ],
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'linear-gradient(45deg, #C2185B, #40C4B4)',
        }}
      />

      {/* Medium liquid shape */}
      <motion.div
        className="absolute top-3/4 right-1/4 w-64 h-64 opacity-8"
        animate={{
          borderRadius: [
            '40% 60% 60% 40% / 40% 40% 60% 60%',
            '60% 40% 40% 60% / 60% 60% 40% 40%',
            '50% 50% 50% 50% / 50% 50% 50% 50%',
            '40% 60% 60% 40% / 40% 40% 60% 60%'
          ],
          rotate: [360, 270, 180, 90, 0],
          scale: [0.8, 1.2, 1, 0.9, 0.8],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{
          background: 'linear-gradient(135deg, #40C4B4, #D4AF37)',
        }}
      />

      {/* Small liquid shapes */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 opacity-6"
          style={{
            top: `${20 + i * 25}%`,
            right: `${10 + i * 15}%`,
            background: `linear-gradient(${45 + i * 60}deg, #D4AF37, #C2185B)`,
          }}
          animate={{
            borderRadius: [
              '30% 70% 70% 30% / 30% 30% 70% 70%',
              '70% 30% 30% 70% / 70% 70% 30% 30%',
              '50% 50% 50% 50% / 50% 50% 50% 50%',
              '30% 70% 70% 30% / 30% 30% 70% 70%'
            ],
            rotate: [0, 120, 240, 360],
            scale: [1, 1.3, 0.7, 1],
            x: [0, 20, -20, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
};

// components/effects/breathing-elements.tsx
export const BreathingElements: React.FC<{
  className?: string;
  elements?: Array<{
    icon: string;
    position: { top: string; left: string };
    color: string;
  }>;
}> = ({ 
  className = '', 
  elements = [
    { icon: '✨', position: { top: '20%', left: '10%' }, color: '#D4AF37' },
    { icon: '🦷', position: { top: '60%', left: '80%' }, color: '#40C4B4' },
    { icon: '💎', position: { top: '40%', left: '20%' }, color: '#C2185B' },
    { icon: '🌊', position: { top: '80%', left: '60%' }, color: '#40C4B4' },
    { icon: '⭐', position: { top: '15%', left: '70%' }, color: '#D4AF37' },
  ]
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl"
          style={{
            top: element.position.top,
            left: element.position.left,
            color: element.color,
            filter: `drop-shadow(0 0 10px ${element.color})`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3 + index * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.8,
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  );
};

// components/effects/ripple-effect.tsx
export const RippleEffect: React.FC<{
  className?: string;
  trigger?: boolean;
  color?: string;
}> = ({ className = '', trigger = false, color = '#40C4B4' }) => {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const createRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
    >
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color,
          }}
          initial={{
            width: 0,
            height: 0,
            opacity: 0.6,
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            width: 400,
            height: 400,
            opacity: 0,
          }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

// components/effects/parallax-layers.tsx
export const ParallaxLayers: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const [scrollY, setScrollY] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {/* Background layer - slowest */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(194, 24, 91, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(64, 196, 180, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)`,
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Middle layer - medium speed */}
      <motion.div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `linear-gradient(45deg, 
            rgba(194, 24, 91, 0.05) 0%, 
            rgba(64, 196, 180, 0.05) 50%, 
            rgba(212, 175, 55, 0.05) 100%)`,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      {/* Foreground layer - fastest */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 100px,
            rgba(255, 255, 255, 0.02) 101px,
            rgba(255, 255, 255, 0.02) 102px
          )`,
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
    </div>
  );
};

