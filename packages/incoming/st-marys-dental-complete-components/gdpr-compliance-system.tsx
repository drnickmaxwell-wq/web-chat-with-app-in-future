// lib/gdpr/compliance-system.ts
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// 1. GDPR COMPLIANCE MANAGER
// ============================================================================

export class GDPRComplianceManager {
  private static instance: GDPRComplianceManager;
  private consentData: Map<string, ConsentRecord> = new Map();

  static getInstance(): GDPRComplianceManager {
    if (!GDPRComplianceManager.instance) {
      GDPRComplianceManager.instance = new GDPRComplianceManager();
    }
    return GDPRComplianceManager.instance;
  }

  // Record consent
  recordConsent(userId: string, consentType: ConsentType, granted: boolean): void {
    const record: ConsentRecord = {
      userId,
      consentType,
      granted,
      timestamp: new Date(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      version: '1.0'
    };

    this.consentData.set(`${userId}-${consentType}`, record);
    this.persistConsent(record);
  }

  // Check if consent is granted
  hasConsent(userId: string, consentType: ConsentType): boolean {
    const record = this.consentData.get(`${userId}-${consentType}`);
    return record?.granted || false;
  }

  // Withdraw consent
  withdrawConsent(userId: string, consentType: ConsentType): void {
    this.recordConsent(userId, consentType, false);
    this.handleConsentWithdrawal(userId, consentType);
  }

  // Get all consent records for a user
  getUserConsents(userId: string): ConsentRecord[] {
    return Array.from(this.consentData.values())
      .filter(record => record.userId === userId);
  }

  // Delete all user data (Right to be forgotten)
  deleteUserData(userId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Delete from local storage
        this.consentData.forEach((record, key) => {
          if (record.userId === userId) {
            this.consentData.delete(key);
          }
        });

        // Delete from server
        await fetch('/api/gdpr/delete-user-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Export user data (Right to data portability)
  exportUserData(userId: string): Promise<UserDataExport> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/gdpr/export-user-data/${userId}`);
        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  private persistConsent(record: ConsentRecord): void {
    // Store in localStorage
    localStorage.setItem(`gdpr-consent-${record.userId}-${record.consentType}`, JSON.stringify(record));
    
    // Send to server
    fetch('/api/gdpr/record-consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }).catch(console.error);
  }

  private handleConsentWithdrawal(userId: string, consentType: ConsentType): void {
    switch (consentType) {
      case 'marketing':
        // Remove from marketing lists
        this.removeFromMarketing(userId);
        break;
      case 'analytics':
        // Stop analytics tracking
        this.disableAnalytics(userId);
        break;
      case 'cookies':
        // Clear non-essential cookies
        this.clearNonEssentialCookies();
        break;
    }
  }

  private removeFromMarketing(userId: string): void {
    fetch('/api/gdpr/remove-from-marketing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    }).catch(console.error);
  }

  private disableAnalytics(userId: string): void {
    // Disable Google Analytics, etc.
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
    }
  }

  private clearNonEssentialCookies(): void {
    // Clear marketing and analytics cookies
    const cookiesToClear = ['_ga', '_gid', '_fbp', '_gat'];
    cookiesToClear.forEach(cookie => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }

  private getClientIP(): string {
    // This would typically be handled server-side
    return 'client-ip-placeholder';
  }
}

// ============================================================================
// 2. TYPES AND INTERFACES
// ============================================================================

export type ConsentType = 'essential' | 'analytics' | 'marketing' | 'cookies' | 'medical';

export interface ConsentRecord {
  userId: string;
  consentType: ConsentType;
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  version: string;
}

export interface UserDataExport {
  personalData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  medicalData: {
    appointments: any[];
    treatments: any[];
    notes: any[];
  };
  consentRecords: ConsentRecord[];
  activityLog: any[];
}

// ============================================================================
// 3. COOKIE CONSENT BANNER
// ============================================================================

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedConsents, setSelectedConsents] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if consent has already been given
    const hasConsent = localStorage.getItem('gdpr-cookie-consent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const gdpr = GDPRComplianceManager.getInstance();
    const userId = getUserId(); // Implement this function
    
    gdpr.recordConsent(userId, 'essential', true);
    gdpr.recordConsent(userId, 'analytics', true);
    gdpr.recordConsent(userId, 'marketing', true);
    
    localStorage.setItem('gdpr-cookie-consent', 'all');
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    const gdpr = GDPRComplianceManager.getInstance();
    const userId = getUserId();
    
    Object.entries(selectedConsents).forEach(([type, granted]) => {
      gdpr.recordConsent(userId, type as ConsentType, granted);
    });
    
    localStorage.setItem('gdpr-cookie-consent', 'selected');
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const gdpr = GDPRComplianceManager.getInstance();
    const userId = getUserId();
    
    gdpr.recordConsent(userId, 'essential', true); // Essential cookies always required
    gdpr.recordConsent(userId, 'analytics', false);
    gdpr.recordConsent(userId, 'marketing', false);
    
    localStorage.setItem('gdpr-cookie-consent', 'essential-only');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl"
        >
          <div className="container mx-auto p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
                <p className="text-gray-600 text-sm">
                  We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts. 
                  You can customize your preferences or accept all cookies.
                </p>
                
                {/* Detailed Options */}
                <div className="mt-4 space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedConsents.essential}
                      disabled
                      className="rounded"
                    />
                    <span className="text-sm">Essential cookies (required)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedConsents.analytics}
                      onChange={(e) => setSelectedConsents(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Analytics cookies</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedConsents.marketing}
                      onChange={(e) => setSelectedConsents(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Marketing cookies</span>
                  </label>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptSelected}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Accept Selected
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 4. PRIVACY PREFERENCES CENTER
// ============================================================================

export const PrivacyPreferencesCenter: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [consents, setConsents] = useState({
    analytics: false,
    marketing: false,
    medical: false
  });

  useEffect(() => {
    if (isOpen) {
      const gdpr = GDPRComplianceManager.getInstance();
      const userId = getUserId();
      
      setConsents({
        analytics: gdpr.hasConsent(userId, 'analytics'),
        marketing: gdpr.hasConsent(userId, 'marketing'),
        medical: gdpr.hasConsent(userId, 'medical')
      });
    }
  }, [isOpen]);

  const handleSave = () => {
    const gdpr = GDPRComplianceManager.getInstance();
    const userId = getUserId();
    
    Object.entries(consents).forEach(([type, granted]) => {
      gdpr.recordConsent(userId, type as ConsentType, granted);
    });
    
    onClose();
  };

  const handleExportData = async () => {
    const gdpr = GDPRComplianceManager.getInstance();
    const userId = getUserId();
    
    try {
      const data = await gdpr.exportUserData(userId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleDeleteData = async () => {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      const gdpr = GDPRComplianceManager.getInstance();
      const userId = getUserId();
      
      try {
        await gdpr.deleteUserData(userId);
        alert('Your data has been deleted successfully.');
        onClose();
      } catch (error) {
        console.error('Deletion failed:', error);
        alert('Failed to delete data. Please contact support.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Privacy Preferences</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Consent Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Processing Consent</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Analytics</h4>
                  <p className="text-sm text-gray-600">Help us improve our website by analyzing usage patterns</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.analytics}
                    onChange={(e) => setConsents(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Marketing</h4>
                  <p className="text-sm text-gray-600">Receive personalized offers and dental health tips</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.marketing}
                    onChange={(e) => setConsents(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Medical Data Processing</h4>
                  <p className="text-sm text-gray-600">Process your medical data for treatment and care coordination</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.medical}
                    onChange={(e) => setConsents(prev => ({ ...prev, medical: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Rights */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Data Rights</h3>
            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium">Export My Data</h4>
                <p className="text-sm text-gray-600">Download a copy of all your personal data</p>
              </button>
              
              <button
                onClick={handleDeleteData}
                className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <h4 className="font-medium text-red-600">Delete My Data</h4>
                <p className="text-sm text-gray-600">Permanently delete all your personal data</p>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// 5. UTILITY FUNCTIONS
// ============================================================================

function getUserId(): string {
  // Implement your user ID logic here
  // This could be from authentication, session, or generated UUID
  let userId = localStorage.getItem('user-id');
  if (!userId) {
    userId = 'user-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user-id', userId);
  }
  return userId;
}

// ============================================================================
// 6. USAGE EXAMPLE
// ============================================================================

/*
// In your main layout or app component:

import { CookieConsentBanner, PrivacyPreferencesCenter } from '@/lib/gdpr/compliance-system';

export default function Layout({ children }) {
  const [showPrivacyCenter, setShowPrivacyCenter] = useState(false);

  return (
    <html>
      <body>
        {children}
        <CookieConsentBanner />
        <PrivacyPreferencesCenter 
          isOpen={showPrivacyCenter} 
          onClose={() => setShowPrivacyCenter(false)} 
        />
        
        // Add privacy link in footer
        <button onClick={() => setShowPrivacyCenter(true)}>
          Privacy Preferences
        </button>
      </body>
    </html>
  );
}
*/

