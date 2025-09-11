'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Cookie, Eye, Settings, Check, X } from 'lucide-react'
import { CookieBanner } from './CookieBanner'
import { PrivacyPreferences } from './PrivacyPreferences'
import { recordConsent, getConsentStatus } from '@/lib/gdpr/consent-manager'

interface ConsentCategory {
  id: string
  name: string
  description: string
  required: boolean
  enabled: boolean
  cookies: string[]
  purposes: string[]
}

interface ConsentManagerProps {
  requiredConsents?: string[]
  onConsentChange?: (consents: Record<string, boolean>) => void
  showBanner?: boolean
  position?: 'bottom' | 'top'
  theme?: 'light' | 'dark' | 'branded'
  className?: string
}

const DEFAULT_CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: 'necessary',
    name: 'Strictly Necessary',
    description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
    required: true,
    enabled: true,
    cookies: ['session_id', 'csrf_token', 'security_token'],
    purposes: ['Website functionality', 'Security', 'User authentication']
  },
  {
    id: 'functional',
    name: 'Functional',
    description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
    required: false,
    enabled: false,
    cookies: ['user_preferences', 'language_setting', 'theme_preference'],
    purposes: ['User preferences', 'Personalization', 'Enhanced functionality']
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    required: false,
    enabled: false,
    cookies: ['_ga', '_gid', '_gat', 'analytics_session'],
    purposes: ['Website analytics', 'Performance monitoring', 'User behavior analysis']
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'These cookies are used to deliver personalized advertisements and track the effectiveness of our marketing campaigns.',
    required: false,
    enabled: false,
    cookies: ['marketing_id', 'ad_tracking', 'conversion_tracking'],
    purposes: ['Personalized advertising', 'Marketing campaigns', 'Conversion tracking']
  }
]

export function ConsentManager({
  requiredConsents = ['necessary'],
  onConsentChange,
  showBanner = true,
  position = 'bottom',
  theme = 'branded',
  className = ''
}: ConsentManagerProps) {
  const [consentCategories, setConsentCategories] = useState<ConsentCategory[]>(DEFAULT_CONSENT_CATEGORIES)
  const [showConsentBanner, setShowConsentBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkExistingConsent()
  }, [])

  const checkExistingConsent = async () => {
    try {
      const existingConsent = await getConsentStatus()
      
      if (existingConsent && existingConsent.timestamp) {
        // Check if consent is still valid (not older than 12 months)
        const consentAge = Date.now() - new Date(existingConsent.timestamp).getTime()
        const maxAge = 365 * 24 * 60 * 60 * 1000 // 12 months in milliseconds
        
        if (consentAge < maxAge) {
          // Apply existing consent
          setConsentCategories(prev => prev.map(category => ({
            ...category,
            enabled: existingConsent.consents[category.id] || category.required
          })))
          setConsentGiven(true)
          setShowConsentBanner(false)
        } else {
          // Consent expired, show banner
          setShowConsentBanner(showBanner)
        }
      } else {
        // No existing consent, show banner
        setShowConsentBanner(showBanner)
      }
    } catch (error) {
      console.error('Error checking consent status:', error)
      setShowConsentBanner(showBanner)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConsentChange = (categoryId: string, enabled: boolean) => {
    setConsentCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, enabled: enabled || category.required }
        : category
    ))
  }

  const handleAcceptAll = async () => {
    const updatedCategories = consentCategories.map(category => ({
      ...category,
      enabled: true
    }))
    
    setConsentCategories(updatedCategories)
    await saveConsent(updatedCategories)
    setShowConsentBanner(false)
    setConsentGiven(true)
  }

  const handleAcceptSelected = async () => {
    await saveConsent(consentCategories)
    setShowConsentBanner(false)
    setShowPreferences(false)
    setConsentGiven(true)
  }

  const handleRejectAll = async () => {
    const updatedCategories = consentCategories.map(category => ({
      ...category,
      enabled: category.required
    }))
    
    setConsentCategories(updatedCategories)
    await saveConsent(updatedCategories)
    setShowConsentBanner(false)
    setConsentGiven(true)
  }

  const saveConsent = async (categories: ConsentCategory[]) => {
    try {
      const consentData = {
        consents: categories.reduce((acc, category) => ({
          ...acc,
          [category.id]: category.enabled
        }), {}),
        timestamp: new Date().toISOString(),
        version: '1.0',
        userAgent: navigator.userAgent,
        ipAddress: await getUserIP()
      }

      await recordConsent(consentData)
      
      // Notify parent component
      onConsentChange?.(consentData.consents)
      
      // Apply consent to cookies and tracking
      applyConsent(categories)
      
    } catch (error) {
      console.error('Error saving consent:', error)
    }
  }

  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('/api/user-ip')
      const data = await response.json()
      return data.ip || 'unknown'
    } catch {
      return 'unknown'
    }
  }

  const applyConsent = (categories: ConsentCategory[]) => {
    categories.forEach(category => {
      if (category.enabled) {
        // Enable cookies and tracking for this category
        enableCategoryTracking(category.id)
      } else {
        // Disable cookies and tracking for this category
        disableCategoryTracking(category.id)
      }
    })
  }

  const enableCategoryTracking = (categoryId: string) => {
    switch (categoryId) {
      case 'analytics':
        // Enable Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            analytics_storage: 'granted'
          })
        }
        break
      case 'marketing':
        // Enable marketing cookies
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted'
          })
        }
        break
    }
  }

  const disableCategoryTracking = (categoryId: string) => {
    switch (categoryId) {
      case 'analytics':
        // Disable Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            analytics_storage: 'denied'
          })
        }
        break
      case 'marketing':
        // Disable marketing cookies
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          })
        }
        break
    }
  }

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-white border-gray-700'
      case 'light':
        return 'bg-white text-gray-900 border-gray-200'
      case 'branded':
      default:
        return 'bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 text-gray-900 border-primary/20'
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <div className={className}>
      {/* Consent Banner */}
      {showConsentBanner && (
        <CookieBanner
          position={position}
          theme={theme}
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
          onCustomize={() => setShowPreferences(true)}
          onClose={() => setShowConsentBanner(false)}
        />
      )}

      {/* Privacy Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${getThemeClasses()}`}>
            
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Privacy Preferences</h2>
                    <p className="text-sm text-gray-600">Manage your cookie and privacy settings</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Consent Categories */}
            <div className="p-6">
              <div className="space-y-6">
                {consentCategories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{category.name}</h3>
                          {category.required && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                        
                        {/* Purposes */}
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-1">Purposes:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {category.purposes.map((purpose, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                {purpose}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Cookies */}
                        <div>
                          <h4 className="text-sm font-medium mb-1">Cookies:</h4>
                          <div className="flex flex-wrap gap-1">
                            {category.cookies.map((cookie, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {cookie}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={category.enabled}
                            disabled={category.required}
                            onChange={(e) => handleConsentChange(category.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className={`relative w-11 h-6 rounded-full peer transition-colors ${
                            category.enabled 
                              ? 'bg-primary' 
                              : 'bg-gray-200'
                          } ${category.required ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform ${
                              category.enabled ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>Your privacy matters to us. Learn more in our{' '}
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptSelected}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consent Status Indicator (for logged-in users) */}
      {consentGiven && (
        <div className="fixed bottom-4 left-4 z-40">
          <button
            onClick={() => setShowPreferences(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow text-sm"
          >
            <Settings className="w-4 h-4" />
            Privacy Settings
          </button>
        </div>
      )}
    </div>
  )
}

// Global consent status hook
export function useConsentStatus() {
  const [consentStatus, setConsentStatus] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadConsentStatus = async () => {
      try {
        const status = await getConsentStatus()
        setConsentStatus(status?.consents || {})
      } catch (error) {
        console.error('Error loading consent status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConsentStatus()
  }, [])

  return { consentStatus, isLoading }
}

