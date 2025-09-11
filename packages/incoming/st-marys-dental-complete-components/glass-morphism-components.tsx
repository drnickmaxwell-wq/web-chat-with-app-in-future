// components/effects/glass-morphism.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassMorphismCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg';
  opacity?: number;
  border?: boolean;
}

export const GlassMorphismCard: React.FC<GlassMorphismCardProps> = ({
  children,
  className = '',
  blur = 'md',
  opacity = 0.1,
  border = true
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  };

  return (
    <motion.div
      className={`
        ${blurClasses[blur]}
        ${border ? 'border border-white/20' : ''}
        rounded-2xl
        shadow-xl
        ${className}
      `}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

export const FloatingGlassPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}> = ({ children, className = '', position = 'top-right' }) => {
  const positionClasses = {
    'top-left': 'top-8 left-8',
    'top-right': 'top-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'bottom-right': 'bottom-8 right-8',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  return (
    <motion.div
      className={`
        absolute z-20
        ${positionClasses[position]}
        backdrop-blur-lg
        bg-white/10
        border border-white/20
        rounded-2xl
        p-6
        shadow-2xl
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.div>
  );
};

export const LayeredGlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  layers?: number;
}> = ({ children, className = '', layers = 3 }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Background layers */}
      {Array.from({ length: layers }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl"
          style={{
            transform: `translate(${index * 4}px, ${index * 4}px)`,
            zIndex: -index
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        />
      ))}
      
      {/* Main content */}
      <motion.div
        className="relative z-10 backdrop-blur-lg bg-white/15 border border-white/20 rounded-2xl p-6 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const GlassNavigation: React.FC<{
  items: Array<{ label: string; href: string; active?: boolean }>;
  className?: string;
}> = ({ items, className = '' }) => {
  return (
    <motion.nav
      className={`
        backdrop-blur-lg
        bg-white/10
        border border-white/20
        rounded-full
        px-6 py-3
        shadow-2xl
        ${className}
      `}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ul className="flex space-x-6">
        {items.map((item, index) => (
          <motion.li key={index}>
            <a
              href={item.href}
              className={`
                px-4 py-2 rounded-full transition-all duration-300
                ${item.active 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {item.label}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
};

export const GlassModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      
      {/* Modal */}
      <motion.div
        className="relative z-10 max-w-lg w-full mx-4 backdrop-blur-lg bg-white/15 border border-white/20 rounded-2xl p-6 shadow-2xl"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        )}
        <div className="text-white">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

