'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty' | 'data:image/...'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
  loading?: 'lazy' | 'eager'
  unoptimized?: boolean
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  style,
  onLoad,
  onError,
  loading = 'lazy',
  unoptimized = false
}: LazyImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before the image enters viewport
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  // Generate blur placeholder if not provided
  const generateBlurDataURL = (w: number = 10, h: number = 10): string => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Create a gradient that matches St Mary's brand colors
      const gradient = ctx.createLinearGradient(0, 0, w, h)
      gradient.addColorStop(0, '#C2185B20') // Magenta with opacity
      gradient.addColorStop(0.5, '#40C4B420') // Turquoise with opacity
      gradient.addColorStop(1, '#D4AF3720') // Gold with opacity
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)
    }
    
    return canvas.toDataURL()
  }

  const handleLoad = () => {
    setImageLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setImageError(true)
    onError?.()
  }

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (
    fill 
      ? '100vw'
      : width && width > 768 
        ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        : '(max-width: 768px) 100vw, 50vw'
  )

  // Generate blur data URL if placeholder is blur and no blurDataURL provided
  const finalBlurDataURL = blurDataURL || (
    placeholder === 'blur' && width && height 
      ? generateBlurDataURL(Math.min(width / 10, 40), Math.min(height / 10, 40))
      : undefined
  )

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Error placeholder */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Actual image - only render when in view or priority */}
      {(isInView || priority) && !imageError && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={`transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={finalBlurDataURL}
          sizes={responsiveSizes}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          unoptimized={unoptimized}
        />
      )}

      {/* Image overlay effects */}
      {imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  )
}

// Specialized components for common use cases
export function HeroImage(props: Omit<LazyImageProps, 'priority' | 'sizes'>) {
  return (
    <LazyImage
      {...props}
      priority={true}
      sizes="100vw"
      className={`w-full h-full object-cover ${props.className || ''}`}
    />
  )
}

export function ThumbnailImage(props: LazyImageProps) {
  return (
    <LazyImage
      {...props}
      quality={60}
      sizes="(max-width: 768px) 50vw, 25vw"
      className={`rounded-lg ${props.className || ''}`}
    />
  )
}

export function ProfileImage(props: LazyImageProps) {
  return (
    <LazyImage
      {...props}
      quality={85}
      sizes="(max-width: 768px) 100px, 150px"
      className={`rounded-full ${props.className || ''}`}
    />
  )
}

// Gallery image with zoom effect
export function GalleryImage(props: LazyImageProps) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-lg">
      <LazyImage
        {...props}
        quality={80}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`transition-transform duration-300 group-hover:scale-105 ${props.className || ''}`}
      />
    </div>
  )
}

// Treatment before/after image comparison
export function ComparisonImage({ 
  beforeSrc, 
  afterSrc, 
  alt, 
  width, 
  height,
  className = '' 
}: {
  beforeSrc: string
  afterSrc: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  const [showAfter, setShowAfter] = useState(false)

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={() => setShowAfter(true)}
      onMouseLeave={() => setShowAfter(false)}
    >
      <LazyImage
        src={beforeSrc}
        alt={`${alt} - Before`}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${showAfter ? 'opacity-0' : 'opacity-100'}`}
      />
      <LazyImage
        src={afterSrc}
        alt={`${alt} - After`}
        width={width}
        height={height}
        className={`absolute inset-0 transition-opacity duration-300 ${showAfter ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
        {showAfter ? 'After' : 'Before'}
      </div>
    </div>
  )
}

