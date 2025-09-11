# St Mary's House Dental Care - Luxury Effects Package

Complete luxury visual effects and animations system for the St Mary's House Dental Care website.

## Brand Colors
- Magenta: #C2185B
- Turquoise: #40C4B4  
- Gold: #D4AF37

## Brand Fonts
- Headings: Montserrat
- Body: Lora

## Package Contents

### 1. Hero Video Section
- `components/hero/HeroVideoSection.tsx` - Full-width 4K video with fallbacks
- `components/hero/VideoBackground.tsx` - Background video component
- `lib/video/video-utils.ts` - Video optimization utilities

### 2. WebGL Wave Effects
- `components/effects/WebGLWaves.tsx` - Interactive gradient wave backgrounds
- `lib/webgl/wave-shader.ts` - WebGL wave shader programs
- `lib/webgl/wave-animation.ts` - Wave animation controller

### 3. Coastal Particles & Floating Elements
- `components/effects/CoastalParticles.tsx` - Floating branded particles
- `components/effects/FloatingSparkles.tsx` - Sparkle effects
- `components/effects/GeometricShapes.tsx` - Floating geometric shapes
- `lib/particles/particle-system.ts` - Particle physics engine

### 4. Advanced Button Effects
- `components/ui/SparkleButton.tsx` - Sparkle button with glow/pulse
- `components/ui/MagneticButton.tsx` - Magnetic attraction effect
- `components/ui/LiquidButton.tsx` - Liquid morphing button
- `components/ui/RippleButton.tsx` - Ripple effect button
- `components/ui/BreathingButton.tsx` - Breathing animation button

### 5. Glass Morphism System
- `components/effects/GlassMorphism.tsx` - Glass morphism wrapper
- `components/ui/GlassCard.tsx` - Glass morphism cards
- `components/ui/GlassPanel.tsx` - Floating glass panels
- `components/layout/GlassHeader.tsx` - Glass morphism header
- `components/layout/GlassFooter.tsx` - Glass morphism footer

### 6. Text & Shape Animations
- `components/effects/TextReveal.tsx` - Character-by-character reveal
- `components/effects/MorphingShapes.tsx` - Gradient morphing backgrounds
- `components/effects/GradientText.tsx` - Gradient text effects
- `components/effects/RippleEffect.tsx` - Ripple animations

### 7. Loading & Micro-Animations
- `components/ui/LuxuryLoader.tsx` - "Loading Luxury Experience" animation
- `components/effects/MicroAnimations.tsx` - Comprehensive micro-animations
- `components/effects/HoverEffects.tsx` - Advanced hover states
- `components/effects/ScrollAnimations.tsx` - Scroll-triggered animations

## Installation

1. Extract all files to your Next.js project
2. Install dependencies: `npm install framer-motion three @react-three/fiber @react-three/drei`
3. Import components where needed
4. Ensure Tailwind CSS includes brand colors in config

## Usage Examples

```tsx
import { HeroVideoSection } from '@/components/hero/HeroVideoSection'
import { WebGLWaves } from '@/components/effects/WebGLWaves'
import { SparkleButton } from '@/components/ui/SparkleButton'

export default function HomePage() {
  return (
    <>
      <WebGLWaves />
      <HeroVideoSection videoSrc="/videos/hero-4k.mp4" />
      <SparkleButton>Book Consultation</SparkleButton>
    </>
  )
}
```

## Brand Consistency

All components use the exact St Mary's brand colors and maintain consistent styling:
- Magenta #C2185B for primary elements
- Turquoise #40C4B4 for secondary elements  
- Gold #D4AF37 for accent elements
- Montserrat font for headings
- Lora font for body text

## Performance Notes

- All animations use hardware acceleration
- WebGL effects include fallbacks for older browsers
- Lazy loading implemented for heavy components
- Optimized for 60fps performance

