import Head from 'next/head'
import { generateMetadata } from '@/lib/seo/metadata-generator'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
  openGraph?: {
    type?: 'website' | 'article' | 'profile'
    title?: string
    description?: string
    images?: string[]
    url?: string
    siteName?: string
    locale?: string
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player'
    site?: string
    creator?: string
    title?: string
    description?: string
    image?: string
  }
  jsonLd?: any[]
  alternateLanguages?: Array<{
    hreflang: string
    href: string
  }>
}

export function SEOHead({
  title,
  description,
  keywords = [],
  canonicalUrl,
  noIndex = false,
  noFollow = false,
  openGraph,
  twitter,
  jsonLd = [],
  alternateLanguages = []
}: SEOHeadProps) {
  // Generate enhanced metadata with St Mary's branding
  const metadata = generateMetadata({
    title,
    description,
    keywords,
    canonicalUrl,
    openGraph,
    twitter
  })

  // Default St Mary's House Dental Care values
  const defaultTitle = "St Mary's House Dental Care | Luxury Coastal Dentistry Shoreham-by-Sea"
  const defaultDescription = "Experience luxury coastal dentistry at St Mary's House Dental Care in Shoreham-by-Sea. Advanced treatments, AI technology, and exceptional patient care by the sea."
  const defaultKeywords = [
    'dentist Shoreham-by-Sea',
    'luxury dental care',
    'coastal dentistry',
    'dental implants',
    'teeth whitening',
    'cosmetic dentistry',
    'emergency dentist',
    'West Sussex dentist'
  ]

  const finalTitle = metadata.title || defaultTitle
  const finalDescription = metadata.description || defaultDescription
  const finalKeywords = [...defaultKeywords, ...keywords]
  const finalCanonicalUrl = canonicalUrl || metadata.canonicalUrl

  // Robots directive
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords.join(', ')} />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content="St Mary's House Dental Care" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      {finalCanonicalUrl && (
        <link rel="canonical" href={finalCanonicalUrl} />
      )}

      {/* Alternate Languages */}
      {alternateLanguages.map((alt) => (
        <link
          key={alt.hreflang}
          rel="alternate"
          hrefLang={alt.hreflang}
          href={alt.href}
        />
      ))}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={openGraph?.type || 'website'} />
      <meta property="og:title" content={openGraph?.title || finalTitle} />
      <meta property="og:description" content={openGraph?.description || finalDescription} />
      <meta property="og:url" content={openGraph?.url || finalCanonicalUrl} />
      <meta property="og:site_name" content={openGraph?.siteName || "St Mary's House Dental Care"} />
      <meta property="og:locale" content={openGraph?.locale || 'en_GB'} />
      
      {/* Open Graph Images */}
      {openGraph?.images?.map((image, index) => (
        <meta key={index} property="og:image" content={image} />
      )) || (
        <>
          <meta property="og:image" content="https://stmaryshousedental.co.uk/images/og-default.jpg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="St Mary's House Dental Care - Luxury Coastal Dentistry" />
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitter?.card || 'summary_large_image'} />
      <meta name="twitter:site" content={twitter?.site || '@StMarysHouseDental'} />
      <meta name="twitter:creator" content={twitter?.creator || '@StMarysHouseDental'} />
      <meta name="twitter:title" content={twitter?.title || finalTitle} />
      <meta name="twitter:description" content={twitter?.description || finalDescription} />
      <meta name="twitter:image" content={twitter?.image || 'https://stmaryshousedental.co.uk/images/twitter-card.jpg'} />

      {/* Additional Meta Tags for Dental Practice */}
      <meta name="geo.region" content="GB-WSX" />
      <meta name="geo.placename" content="Shoreham-by-Sea" />
      <meta name="geo.position" content="50.8322;-0.2736" />
      <meta name="ICBM" content="50.8322, -0.2736" />
      
      {/* Medical/Healthcare Meta Tags */}
      <meta name="medical.specialty" content="Dentistry" />
      <meta name="medical.condition" content="Dental Health" />
      <meta name="healthcare.provider" content="St Mary's House Dental Care" />

      {/* Business Meta Tags */}
      <meta name="business.hours" content="Mon-Fri 08:00-18:00" />
      <meta name="business.phone" content="+441273453109" />
      <meta name="business.email" content="info@stmaryshousedental.co.uk" />

      {/* Theme and Brand Colors */}
      <meta name="theme-color" content="#C2185B" />
      <meta name="msapplication-TileColor" content="#C2185B" />
      <meta name="msapplication-navbutton-color" content="#C2185B" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#C2185B" />

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />

      {/* Structured Data (JSON-LD) */}
      {jsonLd.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}

      {/* Default Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dentist",
            "name": "St Mary's House Dental Care",
            "description": "Luxury coastal dentistry practice in Shoreham-by-Sea offering advanced dental treatments with AI technology and exceptional patient care.",
            "url": "https://stmaryshousedental.co.uk",
            "logo": "https://stmaryshousedental.co.uk/images/logo.png",
            "image": "https://stmaryshousedental.co.uk/images/practice-exterior.jpg",
            "telephone": "+441273453109",
            "email": "info@stmaryshousedental.co.uk",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 High Street",
              "addressLocality": "Shoreham-by-Sea",
              "addressRegion": "West Sussex",
              "postalCode": "BN43 5DA",
              "addressCountry": "GB"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "50.8322",
              "longitude": "-0.2736"
            },
            "openingHours": [
              "Mo-Fr 08:00-18:00",
              "Sa 09:00-17:00"
            ],
            "priceRange": "£££",
            "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Insurance"],
            "currenciesAccepted": "GBP",
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "50.8322",
                "longitude": "-0.2736"
              },
              "geoRadius": "25000"
            },
            "medicalSpecialty": [
              "Cosmetic Dentistry",
              "Dental Implants",
              "Teeth Whitening",
              "Emergency Dentistry",
              "Preventive Dentistry"
            ],
            "hasCredential": {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "Professional License",
              "recognizedBy": {
                "@type": "Organization",
                "name": "General Dental Council"
              }
            },
            "sameAs": [
              "https://www.facebook.com/StMarysHouseDental",
              "https://www.instagram.com/stmaryshousedental",
              "https://www.linkedin.com/company/st-marys-house-dental-care",
              "https://twitter.com/StMarysHouseDental"
            ]
          })
        }}
      />

      {/* Breadcrumb Schema for Navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://stmaryshousedental.co.uk"
              }
            ]
          })
        }}
      />
    </Head>
  )
}

