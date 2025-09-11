'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, CreditCard, CheckCircle } from 'lucide-react'
import { ServiceSelector } from './ServiceSelector'
import { CalendarView } from './CalendarView'
import { PatientForm } from './PatientForm'
import { BookingConfirmation } from './BookingConfirmation'
import { StripePayment } from '@/components/payment/StripePayment'
import { createBooking } from '@/lib/booking/booking-engine'
import { checkAvailability } from '@/lib/calendar/availability-calculator'

interface Service {
  id: string
  name: string
  description?: string
  duration: number // minutes
  price: number // in pence/cents
  category?: string
  requiresDeposit?: boolean
}

interface BookingWidgetProps {
  services: Service[]
  onBookingComplete?: (booking: any) => void
  enablePayments?: boolean
  requireDeposit?: boolean
  depositPercentage?: number
  allowEmergency?: boolean
  className?: string
}

interface BookingData {
  service?: Service
  date?: string
  time?: string
  patient?: any
  payment?: any
  isEmergency?: boolean
}

type BookingStep = 'service' | 'datetime' | 'patient' | 'payment' | 'confirmation'

export function BookingWidget({
  services,
  onBookingComplete,
  enablePayments = true,
  requireDeposit = false,
  depositPercentage = 20,
  allowEmergency = true,
  className = ''
}: BookingWidgetProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('service')
  const [bookingData, setBookingData] = useState<BookingData>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completedBooking, setCompletedBooking] = useState<any>(null)

  const steps = [
    { id: 'service', label: 'Service', icon: User, completed: !!bookingData.service },
    { id: 'datetime', label: 'Date & Time', icon: Calendar, completed: !!bookingData.date && !!bookingData.time },
    { id: 'patient', label: 'Details', icon: User, completed: !!bookingData.patient },
    ...(enablePayments && (requireDeposit || bookingData.service?.requiresDeposit) 
      ? [{ id: 'payment', label: 'Payment', icon: CreditCard, completed: !!bookingData.payment }] 
      : []
    ),
    { id: 'confirmation', label: 'Confirmation', icon: CheckCircle, completed: false }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  const handleServiceSelect = (service: Service, isEmergency = false) => {
    setBookingData(prev => ({ ...prev, service, isEmergency }))
    setCurrentStep('datetime')
    setError(null)
  }

  const handleDateTimeSelect = async (date: string, time: string) => {
    setIsLoading(true)
    try {
      // Check availability
      const isAvailable = await checkAvailability({
        date,
        time,
        duration: bookingData.service?.duration || 60,
        serviceId: bookingData.service?.id
      })

      if (!isAvailable) {
        setError('This time slot is no longer available. Please select another time.')
        return
      }

      setBookingData(prev => ({ ...prev, date, time }))
      setCurrentStep('patient')
      setError(null)
    } catch (err) {
      setError('Failed to check availability. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePatientSubmit = (patientData: any) => {
    setBookingData(prev => ({ ...prev, patient: patientData }))
    
    // Check if payment is required
    if (enablePayments && (requireDeposit || bookingData.service?.requiresDeposit)) {
      setCurrentStep('payment')
    } else {
      handleFinalBooking()
    }
    setError(null)
  }

  const handlePaymentComplete = (paymentData: any) => {
    setBookingData(prev => ({ ...prev, payment: paymentData }))
    handleFinalBooking()
  }

  const handleFinalBooking = async () => {
    setIsLoading(true)
    try {
      const booking = await createBooking({
        ...bookingData,
        depositAmount: calculateDepositAmount(),
        totalAmount: bookingData.service?.price || 0
      })

      setCompletedBooking(booking)
      setCurrentStep('confirmation')
      onBookingComplete?.(booking)
    } catch (err) {
      setError('Failed to create booking. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateDepositAmount = () => {
    if (!bookingData.service?.price) return 0
    if (!requireDeposit && !bookingData.service?.requiresDeposit) return 0
    return Math.round(bookingData.service.price * (depositPercentage / 100))
  }

  const goToStep = (stepId: BookingStep) => {
    const stepIndex = steps.findIndex(step => step.id === stepId)
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    
    // Only allow going back or to completed steps
    if (stepIndex < currentIndex || steps[stepIndex].completed) {
      setCurrentStep(stepId)
      setError(null)
    }
  }

  const goBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as BookingStep)
      setError(null)
    }
  }

  return (
    <div className={`max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Book Your Appointment</h2>
        <p className="opacity-90">
          {bookingData.isEmergency 
            ? 'Emergency appointment booking - we\'ll see you as soon as possible'
            : 'Schedule your visit to St Mary\'s House Dental Care'
          }
        </p>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.completed
            const isAccessible = index <= currentStepIndex || isCompleted

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => isAccessible ? goToStep(step.id as BookingStep) : null}
                  disabled={!isAccessible}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : isAccessible
                      ? 'text-gray-600 hover:bg-gray-100'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                </button>
                
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-gray-300 mx-2" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Processing...</p>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="p-6">
        {currentStep === 'service' && (
          <ServiceSelector
            services={services}
            allowEmergency={allowEmergency}
            onSelect={handleServiceSelect}
          />
        )}

        {currentStep === 'datetime' && bookingData.service && (
          <CalendarView
            service={bookingData.service}
            isEmergency={bookingData.isEmergency}
            onSelect={handleDateTimeSelect}
            onBack={goBack}
          />
        )}

        {currentStep === 'patient' && (
          <PatientForm
            service={bookingData.service}
            isEmergency={bookingData.isEmergency}
            onSubmit={handlePatientSubmit}
            onBack={goBack}
          />
        )}

        {currentStep === 'payment' && bookingData.service && (
          <StripePayment
            amount={calculateDepositAmount()}
            description={`Deposit for ${bookingData.service.name}`}
            onSuccess={handlePaymentComplete}
            onBack={goBack}
          />
        )}

        {currentStep === 'confirmation' && completedBooking && (
          <BookingConfirmation
            booking={completedBooking}
            onNewBooking={() => {
              setCurrentStep('service')
              setBookingData({})
              setCompletedBooking(null)
              setError(null)
            }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-600">
        <p>
          Need help? Call us at{' '}
          <a href="tel:01273453109" className="text-primary hover:underline font-medium">
            01273 453109
          </a>
          {' '}or email{' '}
          <a href="mailto:info@stmaryshousedental.co.uk" className="text-primary hover:underline font-medium">
            info@stmaryshousedental.co.uk
          </a>
        </p>
      </div>
    </div>
  )
}

