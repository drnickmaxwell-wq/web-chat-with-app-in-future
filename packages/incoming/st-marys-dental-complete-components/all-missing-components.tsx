// ============================================================================
// ALL MISSING COMPONENTS FROM OUR CONVERSATIONS
// Complete collection of every component we discussed
// ============================================================================

// 1. COASTAL PARTICLES SYSTEM
// File: /components/effects/coastal-particles.tsx
'use client';

import React, { useEffect, useRef } from 'react';

interface CoastalParticlesProps {
  particleCount?: number;
  colors?: string[];
  className?: string;
}

export const CoastalParticles: React.FC<CoastalParticlesProps> = ({
  particleCount = 80,
  colors = ['#C2185B40', '#40C4B440', '#D4AF3740'],
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number; color: string; opacity: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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
  }, [particleCount, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 1 }}
    />
  );
};

// 2. FLOATING SPARKLES SYSTEM
// File: /components/effects/floating-sparkles.tsx
export const FloatingSparkles: React.FC<{
  sparkleCount?: number;
  colors?: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ sparkleCount = 25, colors = ['#D4AF37', '#FFD700', '#C2185B', '#40C4B4'], size = 'md', className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sparkles: HTMLDivElement[] = [];
    const sizeMap = { sm: 4, md: 6, lg: 8 };
    const sparkleSize = sizeMap[size];

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'absolute pointer-events-none animate-pulse';
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

    return () => sparkles.forEach(sparkle => sparkle.remove());
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

// 3. FLOATING ELEMENTS SYSTEM
// File: /components/effects/floating-elements.tsx
export const FloatingElements: React.FC<{
  count?: number;
  colors?: string[];
  className?: string;
}> = ({ count = 15, colors = ['#C2185B', '#40C4B4', '#D4AF37'], className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements: HTMLDivElement[] = [];
    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      const shapes = ['circle', 'square', 'triangle'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = 8 + Math.random() * 16;
      
      element.className = 'absolute pointer-events-none opacity-30';
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      element.style.left = `${Math.random() * 100}%`;
      element.style.top = `${Math.random() * 100}%`;
      element.style.animation = `floatElement ${4 + Math.random() * 6}s ease-in-out infinite`;
      element.style.animationDelay = `${Math.random() * 3}s`;
      
      if (shape === 'circle') element.style.borderRadius = '50%';
      else if (shape === 'triangle') element.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
      
      container.appendChild(element);
      elements.push(element);
    }

    return () => elements.forEach(element => element.remove());
  }, [count, colors]);

  return (
    <>
      <style jsx>{`
        @keyframes floatElement {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(90deg); }
          50% { transform: translate(-5px, -25px) rotate(180deg); }
          75% { transform: translate(-15px, -10px) rotate(270deg); }
        }
      `}</style>
      <div ref={containerRef} className={`pointer-events-none ${className}`} />
    </>
  );
};

// 4. SCROLL REVEAL SYSTEM
// File: /components/effects/scroll-reveal.tsx
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, direction = 'up', delay = 0, duration = 0.6, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 50, x: 0 };
      case 'down': return { y: -50, x: 0 };
      case 'left': return { x: 50, y: 0 };
      case 'right': return { x: -50, y: 0 };
      default: return { y: 50, x: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 5. ENHANCED WEBGL WAVE EFFECTS (FIXED VERSION)
// File: /components/effects/enhanced-webgl-waves.tsx
export const EnhancedWebGLWaves: React.FC<{
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  speed?: 'slow' | 'medium' | 'fast';
  colors?: string[];
  interactive?: boolean;
}> = ({ className = '', intensity = 'medium', speed = 'medium', colors = ['#C2185B', '#40C4B4', '#D4AF37'], interactive = true }) => {
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

// 6. MAGNETIC BUTTONS
// File: /components/effects/magnetic-buttons.tsx
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  magnetStrength?: number;
}> = ({ children, className = '', magnetStrength = 0.3 }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

// 7. LIQUID MORPHING BUTTONS
// File: /components/effects/liquid-buttons.tsx
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

// 8. BREATHING ANIMATIONS
// File: /components/effects/breathing-elements.tsx
export const BreathingElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  duration?: number;
  scale?: number;
}> = ({ children, className = '', duration = 3, scale = 1.05 }) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
};

// 9. RIPPLE EFFECTS
// File: /components/effects/ripple-effects.tsx
export const RippleEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className = '', color = '#C2185B' }) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color + '40',
          }}
          initial={{ width: 0, height: 0, x: 0, y: 0 }}
          animate={{ width: 300, height: 300, x: -150, y: -150 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

// 10. TEXT REVEAL ANIMATIONS
// File: /components/effects/text-reveal.tsx
export const TextReveal: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}> = ({ text, className = '', delay = 0, duration = 0.05 }) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, duration * 1000);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [text, delay, duration]);

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: index < visibleChars ? 1 : 0, y: index < visibleChars ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

// USAGE INSTRUCTIONS:
/*
1. Create these files in your components/effects/ directory
2. Import them in your pages where needed
3. Add to your homepage:
   - <CoastalParticles />
   - <FloatingSparkles />
   - <FloatingElements />
   - <EnhancedWebGLWaves />

4. Use interactive elements:
   - <MagneticButton>Click me</MagneticButton>
   - <LiquidButton>Liquid Effect</LiquidButton>
   - <RippleEffect>Click for ripples</RippleEffect>

5. Add animations:
   - <BreathingElement>Breathing content</BreathingElement>
   - <TextReveal text="Your text here" />
   - <ScrollReveal>Content to reveal</ScrollReveal>
*/

