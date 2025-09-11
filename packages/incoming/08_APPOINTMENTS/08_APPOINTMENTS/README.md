# Appointments Module

Complete appointment booking system with calendar integration, Stripe payments, and CRM connectivity for St Mary's House Dental Care.

## Features Included

- **Smart Booking Widget**: Intelligent appointment scheduling with availability checking
- **Calendar Integration**: Mock calendar adapter with easy third-party swapping
- **Payment Processing**: Stripe deposit flow with secure payment handling
- **CRM Integration**: Zapier/Dentally connectivity for patient management
- **Email/SMS Notifications**: Automated appointment confirmations and reminders
- **Multi-location Support**: Support for multiple practice locations
- **Emergency Booking**: Priority scheduling for urgent dental care
- **Recurring Appointments**: Support for ongoing treatment plans

## Brand Integration

- Consistent with St Mary's luxury coastal aesthetic
- Professional booking flow with premium feel
- Brand colors and typography throughout
- Coastal-themed confirmation messages

## Installation

1. Extract zip to your project root
2. Copy `src/` contents to your project
3. Configure environment variables from `env.example`
4. Install dependencies from `deps.txt`
5. Set up Stripe and integration API keys (optional - mocks provided)

## File Structure

```
src/
├── components/
│   ├── booking/
│   │   ├── BookingWidget.tsx          # Main booking interface
│   │   ├── CalendarView.tsx           # Calendar availability display
│   │   ├── ServiceSelector.tsx        # Treatment selection
│   │   ├── PatientForm.tsx            # Patient information form
│   │   └── BookingConfirmation.tsx    # Confirmation screen
│   ├── calendar/
│   │   ├── AvailabilityChecker.tsx    # Availability validation
│   │   ├── TimeSlotPicker.tsx         # Time selection component
│   │   └── CalendarGrid.tsx           # Calendar grid display
│   ├── payment/
│   │   ├── StripePayment.tsx          # Stripe payment integration
│   │   ├── PaymentForm.tsx            # Payment form component
│   │   └── PaymentConfirmation.tsx    # Payment success/failure
│   └── notifications/
│       ├── EmailTemplates.tsx         # Email notification templates
│       ├── SMSTemplates.tsx           # SMS notification templates
│       └── NotificationCenter.tsx     # Notification management
├── lib/
│   ├── booking/
│   │   ├── booking-engine.ts          # Core booking logic
│   │   ├── availability-calculator.ts # Availability calculation
│   │   ├── booking-validator.ts       # Booking validation rules
│   │   └── booking-analytics.ts       # Booking analytics
│   ├── calendar/
│   │   ├── calendar-adapter.ts        # Calendar integration adapter
│   │   ├── mock-calendar.ts           # Mock calendar for development
│   │   └── availability-manager.ts    # Availability management
│   ├── integrations/
│   │   ├── stripe-adapter.ts          # Stripe payment integration
│   │   ├── zapier-webhook.ts          # Zapier CRM integration
│   │   ├── dentally-api.ts            # Dentally CRM integration
│   │   ├── email-service.ts           # Email notification service
│   │   └── sms-service.ts             # SMS notification service
│   └── types/
│       ├── booking-types.ts           # TypeScript interfaces
│       └── calendar-types.ts          # Calendar type definitions
├── api/
│   ├── booking/
│   │   ├── availability/route.ts      # Availability checking
│   │   ├── create/route.ts            # Booking creation
│   │   ├── confirm/route.ts           # Booking confirmation
│   │   └── cancel/route.ts            # Booking cancellation
│   ├── payment/
│   │   ├── stripe/route.ts            # Stripe payment processing
│   │   └── webhooks/route.ts          # Payment webhooks
│   └── notifications/
│       ├── email/route.ts             # Email notifications
│       └── sms/route.ts               # SMS notifications
└── demo/
    └── page.tsx                       # Complete demo
```

## Usage Examples

```tsx
import { BookingWidget } from '@/components/booking/BookingWidget'
import { CalendarView } from '@/components/booking/CalendarView'

export default function BookingPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <BookingWidget
        services={[
          { id: 'consultation', name: 'Free Consultation', duration: 30, price: 0 },
          { id: 'cleaning', name: 'Professional Cleaning', duration: 60, price: 120 },
          { id: 'whitening', name: 'Teeth Whitening', duration: 90, price: 450 }
        ]}
        onBookingComplete={(booking) => {
          console.log('Booking completed:', booking)
        }}
        enablePayments={true}
        requireDeposit={true}
        depositPercentage={20}
      />
    </div>
  )
}
```

## Booking Flow

### Step 1: Service Selection
- Treatment/service selection with descriptions
- Duration and pricing information
- Emergency vs. routine appointment options
- Multiple service booking support

### Step 2: Date & Time Selection
- Calendar view with available slots
- Real-time availability checking
- Preferred time selection
- Alternative time suggestions

### Step 3: Patient Information
- Contact details collection
- Medical history (optional)
- Insurance information
- Special requirements or notes

### Step 4: Payment (Optional)
- Secure Stripe payment processing
- Deposit collection for appointments
- Payment method storage for future bookings
- Receipt generation and delivery

### Step 5: Confirmation
- Booking confirmation with details
- Calendar invite generation
- Email and SMS notifications
- Pre-appointment instructions

## Calendar Integration

### Mock Calendar Adapter
- Development-friendly mock calendar
- Configurable availability patterns
- Realistic booking conflicts simulation
- Easy testing of edge cases

### Third-Party Integration
- Clean adapter pattern for easy swapping
- Support for popular calendar systems
- Webhook handling for real-time updates
- Conflict resolution and synchronization

## Payment Processing

### Stripe Integration
- Secure payment processing
- PCI compliance handling
- Multiple payment methods support
- Subscription and recurring payment support
- Refund and dispute management

### Deposit Management
- Configurable deposit percentages
- Automatic deposit calculation
- Deposit refund handling
- Balance payment tracking

## CRM Integration

### Zapier Webhooks
- Automated patient record creation
- Booking synchronization
- Treatment history updates
- Marketing automation triggers

### Dentally API
- Direct CRM integration
- Patient record management
- Appointment synchronization
- Treatment plan integration

## Notification System

### Email Notifications
- Booking confirmations
- Appointment reminders
- Cancellation notifications
- Follow-up communications
- Branded email templates

### SMS Notifications
- Appointment confirmations
- Day-before reminders
- Last-minute changes
- Emergency notifications
- Two-way communication support

## Environment Variables

See `env.example` for Stripe, calendar, CRM, and notification service settings.

