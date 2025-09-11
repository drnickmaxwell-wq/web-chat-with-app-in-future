# St Mary's House Dental Care - Extracted Features

This package contains all missing features from our previous conversations, extracted as standalone Next.js App Router components.

## Features Included

### 1. COASTAL_WAVES
- **Path**: `components/effects/impl/CoastalWaves.tsx`
- **Flag**: `ENABLE_FX_WAVES=true`
- **Description**: WebGL/Canvas coastal wave background with time-based tinting and scroll reactivity

### 2. AI_CONCIERGE_CHATBOT  
- **Path**: `components/ai/Chatbot.tsx`
- **Flag**: `ENABLE_CHATBOT=true`
- **Keys**: `OPENAI_API_KEY` (optional)
- **Description**: Site-wide AI chatbot with voice support and emotion detection

### 3. SPARKLE_EFFECTS
- **Path**: `components/effects/impl/SparkleButton.tsx`
- **Flag**: `ENABLE_FX_SPARKLES=true`
- **Description**: Gold/Teal sparkles and button shimmer effects

### 4. MISSING_COASTAL_EFFECTS
- **File**: `missing-coastal-effects.tsx`
- **Description**: Additional coastal effects from previous builds (foam, tidal, mist, etc.)

### 5. MISSING_ADVANCED_ANIMATIONS
- **File**: `missing-advanced-animations.tsx`
- **Description**: Advanced animations from previous builds (morphing geometry, particles, etc.)

## Installation Order

1. **Core Effects** (no dependencies)
   - COASTAL_WAVES
   - SPARKLE_EFFECTS

2. **AI Features** (requires API setup)
   - AI_CONCIERGE_CHATBOT

3. **Additional Effects** (standalone files)
   - Extract components from missing-*.tsx files as needed

## Global Environment Variables

```env
# Feature Flags (defaults shown)
ENABLE_FX_WAVES=true
ENABLE_FX_SPARKLES=true
ENABLE_CHATBOT=true
ENABLE_VOICE=false
ENABLE_EMOTION=false

# API Keys (optional - graceful fallbacks)
OPENAI_API_KEY=sk-your-key-here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Framework Requirements

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- pnpm package manager

## Usage Pattern

Each feature follows the same pattern:

1. **Check README.md** for installation instructions
2. **Copy files/** to your project at specified paths
3. **Add env variables** from env.txt
4. **Install dependencies** from deps.txt
5. **Import and use** as shown in example.md

## SSR Safety

All features are designed to be SSR-safe:
- Browser-only code uses `next/dynamic` with `ssr: false`
- Graceful fallbacks when APIs/assets are missing
- Feature flags allow complete disabling
- No build failures if keys are missing

## Brand Consistency

All components use your existing Tailwind CSS custom properties:
- `hsl(var(--primary))` - Magenta #C2185B
- `hsl(var(--secondary))` - Turquoise #40C4B4  
- `hsl(var(--accent))` - Gold #D4AF37

No theme changes required - components adapt to your existing design system.

