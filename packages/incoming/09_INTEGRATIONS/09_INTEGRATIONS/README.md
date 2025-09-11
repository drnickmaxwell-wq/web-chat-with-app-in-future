# Integrations Module

Complete integration suite with adapters for Zapier, Stripe, SendGrid, Twilio, HeyGen, and Synthesia for St Mary's House Dental Care.

## Features Included

- **Zapier Integration**: Automated workflows for Dentally CRM and marketing
- **Stripe Payments**: Secure payment processing with webhooks
- **Email Services**: SendGrid and Resend email delivery
- **SMS Services**: Twilio messaging integration
- **AI Avatars**: HeyGen and Synthesia avatar generation
- **Mock Adapters**: Development-friendly mocks when API keys unavailable
- **Webhook Management**: Secure webhook handling and validation
- **Error Handling**: Robust error handling with fallback strategies

## Brand Integration

- Consistent branding across all integration touchpoints
- Professional communication templates
- St Mary's brand voice in all automated messages

## Installation

1. Extract zip to your project root
2. Copy `src/` contents to your project
3. Configure environment variables from `env.example`
4. Install dependencies from `deps.txt`
5. Set up API keys for required services (optional - mocks provided)

## File Structure

```
src/
├── lib/
│   ├── integrations/
│   │   ├── zapier/
│   │   │   ├── zapier-adapter.ts       # Zapier webhook integration
│   │   │   ├── dentally-workflows.ts   # Dentally CRM workflows
│   │   │   └── marketing-automation.ts # Marketing automation
│   │   ├── stripe/
│   │   │   ├── stripe-adapter.ts       # Stripe payment processing
│   │   │   ├── webhook-handler.ts      # Stripe webhook handling
│   │   │   ├── subscription-manager.ts # Subscription management
│   │   │   └── payment-methods.ts      # Payment method management
│   │   ├── email/
│   │   │   ├── sendgrid-adapter.ts     # SendGrid email service
│   │   │   ├── resend-adapter.ts       # Resend email service
│   │   │   ├── email-templates.ts      # Email template management
│   │   │   └── email-scheduler.ts      # Email scheduling
│   │   ├── sms/
│   │   │   ├── twilio-adapter.ts       # Twilio SMS service
│   │   │   ├── sms-templates.ts        # SMS template management
│   │   │   └── sms-scheduler.ts        # SMS scheduling
│   │   ├── ai-avatars/
│   │   │   ├── heygen-adapter.ts       # HeyGen avatar integration
│   │   │   ├── synthesia-adapter.ts    # Synthesia avatar integration
│   │   │   └── avatar-manager.ts       # Avatar management
│   │   └── mocks/
│   │       ├── mock-zapier.ts          # Mock Zapier for development
│   │       ├── mock-stripe.ts          # Mock Stripe for development
│   │       ├── mock-email.ts           # Mock email service
│   │       ├── mock-sms.ts             # Mock SMS service
│   │       └── mock-avatars.ts         # Mock avatar services
│   ├── webhooks/
│   │   ├── webhook-validator.ts        # Webhook signature validation
│   │   ├── webhook-router.ts           # Webhook routing logic
│   │   └── webhook-logger.ts           # Webhook logging and monitoring
│   └── utils/
│       ├── integration-config.ts       # Integration configuration
│       ├── error-handler.ts            # Error handling utilities
│       └── retry-logic.ts              # Retry and fallback logic
├── components/
│   ├── integrations/
│   │   ├── IntegrationStatus.tsx       # Integration status dashboard
│   │   ├── WebhookMonitor.tsx          # Webhook monitoring interface
│   │   └── IntegrationSettings.tsx     # Integration configuration UI
│   └── testing/
│       ├── IntegrationTester.tsx       # Integration testing interface
│       └── MockDataGenerator.tsx       # Mock data generation
├── api/
│   ├── webhooks/
│   │   ├── zapier/route.ts             # Zapier webhook endpoint
│   │   ├── stripe/route.ts             # Stripe webhook endpoint
│   │   └── general/route.ts            # General webhook endpoint
│   ├── integrations/
│   │   ├── test/route.ts               # Integration testing endpoint
│   │   └── status/route.ts             # Integration status endpoint
│   └── services/
│       ├── email/route.ts              # Email service endpoint
│       ├── sms/route.ts                # SMS service endpoint
│       └── avatars/route.ts            # Avatar service endpoint
└── demo/
    └── page.tsx                        # Complete demo
```

## Usage Examples

```tsx
import { ZapierAdapter } from '@/lib/integrations/zapier/zapier-adapter'
import { StripeAdapter } from '@/lib/integrations/stripe/stripe-adapter'
import { EmailService } from '@/lib/integrations/email/sendgrid-adapter'

// Zapier Integration
const zapier = new ZapierAdapter()
await zapier.triggerWorkflow('new-patient', {
  name: 'John Doe',
  email: 'john@example.com',
  treatment: 'Dental Implants'
})

// Stripe Payment
const stripe = new StripeAdapter()
const paymentIntent = await stripe.createPaymentIntent({
  amount: 50000, // £500.00
  currency: 'gbp',
  description: 'Dental Implant Consultation'
})

// Email Notification
const emailService = new EmailService()
await emailService.sendAppointmentConfirmation({
  to: 'patient@example.com',
  appointmentDetails: {
    date: '2024-01-15',
    time: '10:00',
    service: 'Dental Cleaning'
  }
})
```

## Integration Services

### Zapier Integration
- **Dentally CRM Sync**: Patient records and appointment synchronization
- **Marketing Automation**: Lead nurturing and follow-up campaigns
- **Workflow Triggers**: Automated actions based on website events
- **Data Synchronization**: Two-way data sync between systems

### Stripe Payments
- **Payment Processing**: Secure card payments and digital wallets
- **Subscription Management**: Recurring payment plans
- **Webhook Handling**: Real-time payment status updates
- **Refund Management**: Automated and manual refund processing

### Email Services (SendGrid/Resend)
- **Transactional Emails**: Appointment confirmations, reminders
- **Marketing Emails**: Newsletters and promotional campaigns
- **Template Management**: Branded email templates
- **Delivery Tracking**: Email open and click tracking

### SMS Services (Twilio)
- **Appointment Reminders**: Automated SMS reminders
- **Emergency Notifications**: Urgent appointment changes
- **Two-way Messaging**: Patient communication via SMS
- **Delivery Reports**: SMS delivery confirmation

### AI Avatar Services (HeyGen/Synthesia)
- **Avatar Generation**: AI-powered spokesperson videos
- **Script Processing**: Text-to-video conversion
- **Brand Consistency**: Avatars matching practice branding
- **Multi-language Support**: Avatars in different languages

## Mock Services

### Development Mocks
All integrations include mock adapters that:
- Simulate real API responses
- Provide realistic delays and behaviors
- Support error scenario testing
- Work without API keys for development

### Testing Features
- Integration health checks
- Mock data generation
- Error simulation
- Performance testing
- Webhook testing tools

## Webhook Management

### Security
- Signature validation for all webhook sources
- IP allowlisting for trusted sources
- Rate limiting and DDoS protection
- Secure payload handling

### Monitoring
- Webhook delivery tracking
- Failed webhook retry logic
- Integration status monitoring
- Performance metrics collection

## Error Handling

### Resilience Patterns
- Automatic retry with exponential backoff
- Circuit breaker for failing services
- Graceful degradation when services unavailable
- Fallback to alternative services when possible

### Monitoring & Alerting
- Integration health monitoring
- Error rate tracking
- Performance metrics
- Automated alerting for critical failures

## Environment Variables

See `env.example` for all integration API keys, webhook URLs, and configuration settings.

