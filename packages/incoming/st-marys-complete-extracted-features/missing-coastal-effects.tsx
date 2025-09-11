// components/effects/coastal-wave-background.tsx
'use client';

import React, { useEffect, useRef } from 'react';

export const CoastalWaveBackground: React.FC<{
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}> = ({ className = '', intensity = 'medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let time = 0;

    const waves = [
      { amplitude: 60, frequency: 0.008, phase: 0, color: '#C2185B', opacity: 0.15 },
      { amplitude: 40, frequency: 0.012, phase: Math.PI / 3, color: '#40C4B4', opacity: 0.12 },
      { amplitude: 80, frequency: 0.006, phase: Math.PI / 2, color: '#D4AF37', opacity: 0.08 },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 2) {
          const y = canvas.height * 0.7 + 
            Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 1.5 + time * 0.8) * wave.amplitude * 0.3;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, wave.color + Math.floor(wave.opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, wave.color + '00');

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      time += intensity === 'strong' ? 0.04 : intensity === 'medium' ? 0.02 : 0.01;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
};

// components/effects/coastal-foam-effect.tsx
export const CoastalFoamEffect: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const foamBubbles: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speed: number;
      life: number;
    }> = [];

    const createBubble = () => {
      foamBubbles.push({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.7 + Math.random() * 100,
        radius: Math.random() * 8 + 2,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 2 + 0.5,
        life: Math.random() * 100 + 50
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new bubbles
      if (Math.random() < 0.3) {
        createBubble();
      }

      // Update and draw bubbles
      for (let i = foamBubbles.length - 1; i >= 0; i--) {
        const bubble = foamBubbles[i];
        
        bubble.y -= bubble.speed;
        bubble.life--;
        bubble.opacity *= 0.995;

        if (bubble.life <= 0 || bubble.opacity < 0.01) {
          foamBubbles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = bubble.opacity;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      foamBubbles.length = 0;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

// components/effects/tidal-animation.tsx
export const TidalAnimation: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0">
        {/* Tidal wave layers */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(45deg, 
              rgba(194, 24, 91, 0.1) 0%, 
              rgba(64, 196, 180, 0.1) 50%, 
              rgba(212, 175, 55, 0.1) 100%)`,
            animation: 'tidalFlow 20s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            background: `radial-gradient(ellipse at center bottom, 
              rgba(64, 196, 180, 0.2) 0%, 
              transparent 70%)`,
            animation: 'tidalPulse 15s ease-in-out infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes tidalFlow {
          0%, 100% { transform: translateX(-10%) scale(1); }
          50% { transform: translateX(10%) scale(1.1); }
        }
        
        @keyframes tidalPulse {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.2) translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

// components/effects/ocean-depth-gradient.tsx
export const OceanDepthGradient: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            rgba(64, 196, 180, 0.05) 0%,
            rgba(64, 196, 180, 0.1) 30%,
            rgba(194, 24, 91, 0.08) 60%,
            rgba(212, 175, 55, 0.06) 100%)`,
          animation: 'oceanDepth 25s ease-in-out infinite'
        }}
      />
      
      <style jsx>{`
        @keyframes oceanDepth {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// components/effects/seashell-sparkles.tsx
export const SeashellSparkles: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const sparkles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2
  }));

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animation: `seashellSparkle ${sparkle.duration}s ease-in-out infinite`,
            animationDelay: `${sparkle.delay}s`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes seashellSparkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1) rotate(180deg); 
          }
        }
      `}</style>
    </div>
  );
};

// components/effects/coastal-mist.tsx
export const CoastalMist: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        {/* Mist layers */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 20% 80%, 
              rgba(255, 255, 255, 0.1) 0%, 
              transparent 50%)`,
            animation: 'mistDrift1 30s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at 80% 60%, 
              rgba(64, 196, 180, 0.05) 0%, 
              transparent 60%)`,
            animation: 'mistDrift2 25s ease-in-out infinite reverse'
          }}
        />
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            background: `radial-gradient(ellipse at 50% 90%, 
              rgba(194, 24, 91, 0.03) 0%, 
              transparent 70%)`,
            animation: 'mistDrift3 35s ease-in-out infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes mistDrift1 {
          0%, 100% { transform: translateX(-20%) translateY(10%) scale(1); }
          50% { transform: translateX(20%) translateY(-10%) scale(1.1); }
        }
        
        @keyframes mistDrift2 {
          0%, 100% { transform: translateX(15%) translateY(-5%) scale(0.9); }
          50% { transform: translateX(-15%) translateY(15%) scale(1.2); }
        }
        
        @keyframes mistDrift3 {
          0%, 100% { transform: translateX(-10%) translateY(5%) scale(1.1); }
          50% { transform: translateX(10%) translateY(-15%) scale(0.8); }
        }
      `}</style>
    </div>
  );
};

