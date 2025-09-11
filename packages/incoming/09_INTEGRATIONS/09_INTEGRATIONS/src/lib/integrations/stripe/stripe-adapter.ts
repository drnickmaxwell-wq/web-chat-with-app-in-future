import Stripe from 'stripe'

interface PaymentIntentData {
  amount: number // in pence/cents
  currency: string
  description?: string
  metadata?: Record<string, string>
  customerId?: string
  paymentMethodId?: string
}

interface SubscriptionData {
  customerId: string
  priceId: string
  metadata?: Record<string, string>
}

interface CustomerData {
  email: string
  name?: string
  phone?: string
  metadata?: Record<string, string>
}

export class StripeAdapter {
  private stripe: Stripe | null = null
  private isInitialized = false

  constructor() {
    this.initialize()
  }

  private initialize() {
    const apiKey = process.env.STRIPE_SECRET_KEY
    
    if (apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2023-10-16',
        typescript: true
      })
      this.isInitialized = true
    } else {
      console.warn('Stripe API key not found. Using mock mode.')
      this.isInitialized = false
    }
  }

  // Payment Intent Methods
  async createPaymentIntent(data: PaymentIntentData): Promise<any> {
    if (!this.isInitialized || !this.stripe) {
      return this.mockCreatePaymentIntent(data)
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        metadata: {
          practice: 'St Marys House Dental Care',
          ...data.metadata
        },
        customer: data.customerId,
        payment_method: data.paymentMethodId,
        automatic_payment_methods: {
          enabled: true
        }
      })

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error)
      throw new Error('Payment processing failed')
    }
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string): Promise<any> {
    if (!this.isInitialized || !this.stripe) {
      return this.mockConfirmPaymentIntent(paymentIntentId)
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      })

      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    } catch (error) {
      console.error('Stripe payment intent confirmation failed:', error)
      throw new Error('Payment confirmation failed')
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<any> {
    if (!this.isInitialized || !this.stripe) {
      return this.mockRetrievePaymentIntent(paymentIntentId)
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)
      
      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        description: paymentIntent.description,
        metadata: paymentIntent.metadata
      }
    } catch (error) {
      console.error('Stripe payment intent retrieval failed:', error)
      throw new Error('Payment retrieval failed')
    }
  }

  // Customer Methods
  async createCustomer(data: CustomerData): Promise<any> {
    if (!this.isInitialized || !this.stripe) {
      return this.mockCreateCustomer(data)
    }

    try {
      const customer = await this.stripe.customers.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
        metadata: {
          practice: 'St Marys House Dental Care',
          ...data.metadata
        }
      })

      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone
      }
    } catch (error) {
      console.error('Stripe customer creation failed:', error)
      throw new Error('Customer creation failed')
    }
  }

  async retrieveCustomer(customerId: string): Promise<any> {
    if (!this.isInitialized || !this.stripe) {
      return this.mockRetrieveCustomer(customerId)
    }

    try {
      const customer = await this.stripe.customers.retrieve(customerId)
      
      if (customer.deleted) {
        throw new Error('Customer not found')
      }

      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        metadata: customer.metadata
      }
    } catch (error) {
      console.error('Stripe customer retrieval failed:', error)
      throw new Error('Customer retrieval failed')
    }
  }

  // Subscription Methods
  async createSubscription(data: SubscriptionData): Promise<any> {
    if (!this.isInitialized || !this.stripe) {
      return this.mockCreateSubscription(data)
    }

    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: data.customerId,
        items: [{ price: data.priceId }],
        metadata: {
          practice: 'St Marys House Dental Care',
          ...data.metadata
        },
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      })

      return {
        id: subscription.id,
        status: subscription.status,
        customerId: subscription.customer,
        priceId: subscription.items.data[0].price.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret
      }
    } catch (error) {
      console.error('Stripe subscription creation failed:', error)
      throw new Error('Subscription creation failed')
    }
  }

  // Refund Methods
  async createRefund(paymentIntentId: string, amount?: number): Promise<any> {
    if (!this.isInitialized || !this.stripe) {
      return this.mockCreateRefund(paymentIntentId, amount)
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount,
        metadata: {
          practice: 'St Marys House Dental Care',
          refund_reason: 'Requested by patient'
        }
      })

      return {
        id: refund.id,
        status: refund.status,
        amount: refund.amount,
        currency: refund.currency
      }
    } catch (error) {
      console.error('Stripe refund creation failed:', error)
      throw new Error('Refund processing failed')
    }
  }

  // Webhook Methods
  constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event | null {
    if (!this.isInitialized || !this.stripe) {
      return this.mockWebhookEvent()
    }

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
      if (!webhookSecret) {
        throw new Error('Webhook secret not configured')
      }

      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (error) {
      console.error('Stripe webhook verification failed:', error)
      return null
    }
  }

  // Mock Methods (for development without API keys)
  private mockCreatePaymentIntent(data: PaymentIntentData): Promise<any> {
    return Promise.resolve({
      id: `pi_mock_${Date.now()}`,
      clientSecret: `pi_mock_${Date.now()}_secret_mock`,
      status: 'requires_payment_method',
      amount: data.amount,
      currency: data.currency
    })
  }

  private mockConfirmPaymentIntent(paymentIntentId: string): Promise<any> {
    return Promise.resolve({
      id: paymentIntentId,
      status: 'succeeded',
      amount: 50000,
      currency: 'gbp'
    })
  }

  private mockRetrievePaymentIntent(paymentIntentId: string): Promise<any> {
    return Promise.resolve({
      id: paymentIntentId,
      status: 'succeeded',
      amount: 50000,
      currency: 'gbp',
      description: 'Mock payment for development',
      metadata: { practice: 'St Marys House Dental Care' }
    })
  }

  private mockCreateCustomer(data: CustomerData): Promise<any> {
    return Promise.resolve({
      id: `cus_mock_${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone
    })
  }

  private mockRetrieveCustomer(customerId: string): Promise<any> {
    return Promise.resolve({
      id: customerId,
      email: 'mock@example.com',
      name: 'Mock Customer',
      phone: '+44 1234 567890',
      metadata: { practice: 'St Marys House Dental Care' }
    })
  }

  private mockCreateSubscription(data: SubscriptionData): Promise<any> {
    return Promise.resolve({
      id: `sub_mock_${Date.now()}`,
      status: 'incomplete',
      customerId: data.customerId,
      priceId: data.priceId,
      clientSecret: `seti_mock_${Date.now()}_secret_mock`
    })
  }

  private mockCreateRefund(paymentIntentId: string, amount?: number): Promise<any> {
    return Promise.resolve({
      id: `re_mock_${Date.now()}`,
      status: 'succeeded',
      amount: amount || 50000,
      currency: 'gbp'
    })
  }

  private mockWebhookEvent(): Stripe.Event {
    return {
      id: `evt_mock_${Date.now()}`,
      object: 'event',
      api_version: '2023-10-16',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: `pi_mock_${Date.now()}`,
          object: 'payment_intent',
          status: 'succeeded'
        }
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
      type: 'payment_intent.succeeded'
    } as Stripe.Event
  }

  // Utility Methods
  isConfigured(): boolean {
    return this.isInitialized
  }

  formatAmount(amount: number, currency: string = 'gbp'): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100)
  }
}

