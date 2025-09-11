# Security & GDPR Compliance Module

Complete security and GDPR compliance implementation with consent management, data protection, and privacy controls for St Mary's House Dental Care.

## Features Included

- **GDPR Consent Manager**: Cookie consent and data processing consent
- **Data Subject Rights**: Export, deletion, and rectification endpoints
- **Privacy Controls**: Granular privacy settings and preferences
- **Security Headers**: Comprehensive security header implementation
- **Data Encryption**: Client-side and server-side encryption utilities
- **Audit Logging**: Comprehensive activity and access logging
- **Cookie Management**: GDPR-compliant cookie handling
- **Privacy Policy Generator**: Dynamic privacy policy generation

## Brand Integration

- St Mary's branded consent interfaces
- Professional privacy notices
- Coastal-themed privacy experience
- Trust-building security messaging

## Installation

1. Extract zip to your project root
2. Copy `src/` contents to your project
3. Configure environment variables from `env.example`
4. Install dependencies from `deps.txt`
5. Configure encryption keys and security settings

## File Structure

```
src/
├── components/
│   ├── gdpr/
│   │   ├── ConsentManager.tsx          # Main consent management interface
│   │   ├── CookieBanner.tsx            # Cookie consent banner
│   │   ├── PrivacyPreferences.tsx      # User privacy preferences
│   │   ├── DataExportRequest.tsx       # Data export request form
│   │   └── DataDeletionRequest.tsx     # Data deletion request form
│   ├── security/
│   │   ├── SecurityHeaders.tsx         # Security header component
│   │   ├── CSPProvider.tsx             # Content Security Policy provider
│   │   ├── TwoFactorAuth.tsx           # Two-factor authentication
│   │   └── SessionManager.tsx          # Secure session management
│   ├── privacy/
│   │   ├── PrivacyNotice.tsx           # Privacy notice display
│   │   ├── CookieSettings.tsx          # Cookie preference settings
│   │   ├── DataProcessingInfo.tsx      # Data processing information
│   │   └── ConsentHistory.tsx          # Consent history tracking
│   └── audit/
│       ├── ActivityLogger.tsx          # User activity logging
│       ├── AccessLogger.tsx            # Access attempt logging
│       └── AuditTrail.tsx              # Audit trail display
├── lib/
│   ├── gdpr/
│   │   ├── consent-manager.ts          # Consent management logic
│   │   ├── data-subject-rights.ts      # GDPR rights implementation
│   │   ├── cookie-manager.ts           # Cookie management utilities
│   │   ├── privacy-settings.ts         # Privacy preference management
│   │   └── compliance-checker.ts       # GDPR compliance validation
│   ├── security/
│   │   ├── encryption.ts               # Data encryption utilities
│   │   ├── security-headers.ts         # Security header configuration
│   │   ├── csrf-protection.ts          # CSRF token management
│   │   ├── rate-limiting.ts            # Rate limiting implementation
│   │   └── input-validation.ts         # Input sanitization and validation
│   ├── privacy/
│   │   ├── data-processor.ts           # Data processing utilities
│   │   ├── anonymization.ts            # Data anonymization tools
│   │   ├── retention-manager.ts        # Data retention management
│   │   └── privacy-policy-generator.ts # Dynamic privacy policy generation
│   ├── audit/
│   │   ├── activity-tracker.ts         # User activity tracking
│   │   ├── access-logger.ts            # Access logging utilities
│   │   ├── audit-reporter.ts           # Audit report generation
│   │   └── compliance-monitor.ts       # Compliance monitoring
│   └── utils/
│       ├── data-validator.ts           # Data validation utilities
│       ├── secure-storage.ts           # Secure local storage
│       └── crypto-utils.ts             # Cryptographic utilities
├── api/
│   ├── gdpr/
│   │   ├── consent/route.ts            # Consent management API
│   │   ├── export/route.ts             # Data export API
│   │   ├── delete/route.ts             # Data deletion API
│   │   └── preferences/route.ts        # Privacy preferences API
│   ├── security/
│   │   ├── csrf/route.ts               # CSRF token API
│   │   ├── session/route.ts            # Session management API
│   │   └── audit/route.ts              # Security audit API
│   └── privacy/
│       ├── policy/route.ts             # Privacy policy API
│       ├── cookies/route.ts            # Cookie management API
│       └── compliance/route.ts         # Compliance status API
└── demo/
    └── page.tsx                        # Complete demo
```

## Usage Examples

```tsx
import { ConsentManager } from '@/components/gdpr/ConsentManager'
import { SecurityHeaders } from '@/components/security/SecurityHeaders'
import { PrivacyPreferences } from '@/components/gdpr/PrivacyPreferences'

export default function SecurePage() {
  return (
    <>
      <SecurityHeaders />
      <ConsentManager
        requiredConsents={['necessary', 'analytics', 'marketing']}
        onConsentChange={(consents) => {
          console.log('Consent updated:', consents)
        }}
      />
      <PrivacyPreferences />
    </>
  )
}
```

## GDPR Compliance

### Consent Management
- **Granular Consent**: Separate consent for different data processing purposes
- **Consent Recording**: Timestamped consent records with IP and user agent
- **Consent Withdrawal**: Easy consent withdrawal mechanisms
- **Consent Renewal**: Automatic consent expiration and renewal prompts

### Data Subject Rights
- **Right to Access**: Complete data export functionality
- **Right to Rectification**: Data correction and update mechanisms
- **Right to Erasure**: Secure data deletion with verification
- **Right to Portability**: Structured data export in common formats
- **Right to Object**: Opt-out mechanisms for data processing

### Cookie Management
- **Cookie Categorization**: Essential, functional, analytics, and marketing cookies
- **Cookie Consent**: Granular cookie consent with opt-in/opt-out
- **Cookie Inventory**: Complete list of cookies used by the site
- **Third-party Cookies**: Management of external service cookies

### Privacy by Design
- **Data Minimization**: Collect only necessary data
- **Purpose Limitation**: Use data only for stated purposes
- **Storage Limitation**: Automatic data retention and deletion
- **Transparency**: Clear privacy notices and data processing information

## Security Features

### Data Protection
- **Encryption at Rest**: Database and file encryption
- **Encryption in Transit**: TLS/SSL for all communications
- **Client-side Encryption**: Sensitive data encrypted before transmission
- **Key Management**: Secure encryption key storage and rotation

### Access Control
- **Authentication**: Multi-factor authentication support
- **Authorization**: Role-based access control (RBAC)
- **Session Management**: Secure session handling with timeout
- **API Security**: JWT tokens with proper validation

### Security Headers
- **Content Security Policy (CSP)**: XSS protection
- **HTTP Strict Transport Security (HSTS)**: Force HTTPS
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection
- **Referrer-Policy**: Referrer information control

### Input Validation
- **XSS Prevention**: Input sanitization and output encoding
- **SQL Injection Protection**: Parameterized queries and validation
- **CSRF Protection**: Cross-site request forgery tokens
- **Rate Limiting**: API and form submission rate limiting

## Audit & Compliance

### Activity Logging
- **User Actions**: Comprehensive user activity tracking
- **Data Access**: Log all data access and modifications
- **System Events**: Security-relevant system event logging
- **Consent Changes**: Track all consent modifications

### Compliance Monitoring
- **GDPR Compliance**: Automated compliance checking
- **Data Breach Detection**: Unusual activity monitoring
- **Access Pattern Analysis**: Detect suspicious access patterns
- **Compliance Reporting**: Regular compliance status reports

### Audit Trail
- **Immutable Logs**: Tamper-proof audit logging
- **Log Retention**: Configurable log retention periods
- **Log Export**: Audit log export for compliance reviews
- **Real-time Monitoring**: Live compliance monitoring dashboard

## Privacy Controls

### User Preferences
- **Privacy Dashboard**: Centralized privacy control interface
- **Data Visibility**: Show users what data is collected
- **Processing Purposes**: Clear explanation of data use
- **Retention Periods**: Display data retention information

### Consent Interface
- **Clear Language**: Plain English privacy notices
- **Granular Controls**: Separate controls for different data types
- **Visual Indicators**: Clear consent status indicators
- **Mobile Optimized**: Touch-friendly consent interfaces

## Data Processing

### Lawful Basis
- **Consent**: Explicit consent for non-essential processing
- **Contract**: Processing necessary for service delivery
- **Legal Obligation**: Compliance with legal requirements
- **Legitimate Interest**: Balanced legitimate interest assessment

### Data Categories
- **Personal Data**: Name, email, phone, address
- **Special Categories**: Health data (dental records)
- **Technical Data**: IP addresses, cookies, device information
- **Usage Data**: Website interaction and behavior data

### Processing Activities
- **Appointment Booking**: Patient scheduling and management
- **Treatment Records**: Dental treatment documentation
- **Marketing Communications**: Newsletter and promotional emails
- **Website Analytics**: Usage statistics and optimization

## Medical Data Compliance

### Healthcare Regulations
- **HIPAA Considerations**: US healthcare data protection
- **Medical Device Regulation**: Compliance for dental equipment data
- **Professional Standards**: Dental professional body requirements
- **Cross-border Transfers**: International data transfer safeguards

### Patient Data Protection
- **Medical Record Security**: Enhanced protection for health data
- **Access Controls**: Strict access controls for medical staff
- **Data Sharing**: Secure sharing with healthcare providers
- **Retention Policies**: Medical record retention requirements

## Environment Variables

See `env.example` for encryption keys, security settings, and compliance configuration.

