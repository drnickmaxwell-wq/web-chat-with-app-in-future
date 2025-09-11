# Performance & PWA Module

Complete performance optimization and Progressive Web App implementation for St Mary's House Dental Care.

## Features Included

- **Image Optimization**: Next.js Image component with lazy loading and WebP conversion
- **Code Splitting**: Dynamic imports and route-based code splitting
- **Caching Strategy**: Service worker with intelligent caching
- **PWA Features**: App manifest, offline support, push notifications
- **Performance Monitoring**: Core Web Vitals tracking and optimization
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Font Optimization**: Preloading and font display optimization
- **Resource Hints**: Preconnect, prefetch, and preload optimization

## Brand Integration

- Optimized loading of St Mary's brand assets
- Coastal-themed offline experience
- Brand-consistent PWA icons and splash screens

## Installation

1. Extract zip to your project root
2. Copy `src/` contents to your project
3. Configure environment variables from `env.example`
4. Install dependencies from `deps.txt`
5. Configure service worker and PWA settings

## File Structure

```
src/
├── components/
│   ├── optimization/
│   │   ├── LazyImage.tsx              # Optimized image component
│   │   ├── LazyComponent.tsx          # Lazy loading wrapper
│   │   ├── CriticalCSS.tsx            # Critical CSS inlining
│   │   └── ResourceHints.tsx          # Resource hint management
│   ├── pwa/
│   │   ├── PWAInstallPrompt.tsx       # PWA installation prompt
│   │   ├── OfflineIndicator.tsx       # Offline status indicator
│   │   ├── UpdatePrompt.tsx           # App update notification
│   │   └── PushNotifications.tsx      # Push notification handler
│   └── performance/
│       ├── PerformanceMonitor.tsx     # Performance tracking
│       ├── WebVitalsReporter.tsx      # Core Web Vitals reporting
│       └── ErrorBoundary.tsx          # Error boundary with reporting
├── lib/
│   ├── optimization/
│   │   ├── image-optimizer.ts         # Image optimization utilities
│   │   ├── code-splitter.ts           # Dynamic import utilities
│   │   ├── bundle-analyzer.ts         # Bundle analysis tools
│   │   └── cache-manager.ts           # Caching strategy management
│   ├── pwa/
│   │   ├── service-worker.ts          # Service worker logic
│   │   ├── manifest-generator.ts      # PWA manifest generation
│   │   ├── offline-manager.ts         # Offline functionality
│   │   └── push-manager.ts            # Push notification management
│   ├── performance/
│   │   ├── metrics-collector.ts       # Performance metrics collection
│   │   ├── vitals-tracker.ts          # Core Web Vitals tracking
│   │   ├── error-reporter.ts          # Error reporting and tracking
│   │   └── analytics-integration.ts   # Performance analytics
│   └── utils/
│       ├── lazy-loader.ts             # Lazy loading utilities
│       ├── preloader.ts               # Resource preloading
│       └── compression.ts             # Asset compression utilities
├── public/
│   ├── sw.js                          # Service worker file
│   ├── manifest.json                  # PWA manifest
│   ├── icons/                         # PWA icons (various sizes)
│   └── offline.html                   # Offline fallback page
├── api/
│   ├── performance/
│   │   ├── metrics/route.ts           # Performance metrics API
│   │   ├── vitals/route.ts            # Core Web Vitals API
│   │   └── reports/route.ts           # Performance reports
│   └── pwa/
│       ├── manifest/route.ts          # Dynamic manifest generation
│       └── push/route.ts              # Push notification API
└── demo/
    └── page.tsx                       # Complete demo
```

## Usage Examples

```tsx
import { LazyImage } from '@/components/optimization/LazyImage'
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt'
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor'

export default function OptimizedPage() {
  return (
    <>
      <PerformanceMonitor />
      
      <LazyImage
        src="/images/dental-treatment.jpg"
        alt="Dental treatment at St Mary's House"
        width={800}
        height={600}
        priority={true}
        placeholder="blur"
      />
      
      <PWAInstallPrompt />
    </>
  )
}
```

## Performance Optimizations

### Image Optimization
- **Next.js Image Component**: Automatic WebP conversion and responsive images
- **Lazy Loading**: Images load only when entering viewport
- **Placeholder Strategy**: Blur, color, or skeleton placeholders
- **Priority Loading**: Critical images loaded immediately
- **Responsive Images**: Multiple sizes for different screen densities

### Code Splitting
- **Route-based Splitting**: Automatic page-level code splitting
- **Component-level Splitting**: Dynamic imports for heavy components
- **Library Splitting**: Separate chunks for third-party libraries
- **Preloading**: Intelligent preloading of likely-needed chunks

### Caching Strategy
- **Service Worker**: Intelligent caching with cache-first and network-first strategies
- **Static Assets**: Long-term caching for images, fonts, and CSS
- **API Responses**: Smart caching of API responses with TTL
- **Offline Support**: Cached content available offline

### Bundle Optimization
- **Tree Shaking**: Removal of unused code
- **Minification**: JavaScript and CSS minification
- **Compression**: Gzip and Brotli compression
- **Bundle Analysis**: Webpack bundle analyzer integration

## PWA Features

### App Manifest
- **App Identity**: Name, description, and branding
- **Display Mode**: Standalone app experience
- **Theme Colors**: St Mary's brand colors
- **Icons**: Multiple sizes for different devices
- **Start URL**: Optimized landing page

### Service Worker
- **Caching Strategy**: Intelligent resource caching
- **Offline Support**: Offline page and functionality
- **Background Sync**: Queue actions when offline
- **Push Notifications**: Appointment reminders and updates

### Installation
- **Install Prompt**: Custom PWA installation prompt
- **Installation Tracking**: Analytics for PWA installations
- **Update Notifications**: Prompt users for app updates
- **Cross-platform**: Works on desktop and mobile

## Performance Monitoring

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: Loading performance
- **First Input Delay (FID)**: Interactivity measurement
- **Cumulative Layout Shift (CLS)**: Visual stability
- **First Contentful Paint (FCP)**: Rendering performance

### Real User Monitoring
- **Performance API**: Browser performance metrics
- **User Experience Tracking**: Real user performance data
- **Error Tracking**: JavaScript error monitoring
- **Analytics Integration**: Performance data in analytics

### Optimization Recommendations
- **Performance Audits**: Automated performance analysis
- **Optimization Suggestions**: Actionable improvement recommendations
- **A/B Testing**: Performance optimization testing
- **Continuous Monitoring**: Ongoing performance tracking

## Caching Strategies

### Static Assets
- **Long-term Caching**: Images, fonts, and CSS cached for 1 year
- **Cache Busting**: Automatic cache invalidation on updates
- **CDN Integration**: Content delivery network optimization
- **Compression**: Gzip and Brotli compression

### Dynamic Content
- **Stale-while-revalidate**: Serve cached content while updating
- **Network-first**: Fresh content with cache fallback
- **Cache-first**: Fast loading with network updates
- **Runtime Caching**: Dynamic caching based on usage patterns

## Font Optimization

### Font Loading
- **Font Display**: Optimal font display strategies
- **Preloading**: Critical font preloading
- **Font Subsetting**: Load only required characters
- **Fallback Fonts**: System font fallbacks

### Web Fonts
- **Google Fonts**: Optimized Google Fonts loading
- **Self-hosted Fonts**: Local font hosting for performance
- **Font Swapping**: Smooth font loading transitions
- **Variable Fonts**: Single file for multiple weights

## Resource Hints

### Preloading
- **Critical Resources**: Preload critical CSS and JavaScript
- **Above-fold Images**: Preload hero images
- **Fonts**: Preload important fonts
- **API Data**: Preload critical API responses

### Prefetching
- **Next Pages**: Prefetch likely next pages
- **User Intent**: Prefetch based on user behavior
- **Hover Prefetch**: Prefetch on link hover
- **Intersection Observer**: Prefetch when elements are visible

## Environment Variables

See `env.example` for performance monitoring, PWA configuration, and analytics settings.

