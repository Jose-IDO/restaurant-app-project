import { Platform } from 'react-native';

// Stripe publishable key - use test key for demo
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51...';

let stripeInitialized = false;

// Only import Stripe on native platforms (not web)
let initStripe: any;
let presentPaymentSheet: any;
let createPaymentMethod: any;

if (Platform.OS !== 'web') {
  try {
    const stripeModule = require('@stripe/stripe-react-native');
    initStripe = stripeModule.initStripe;
    presentPaymentSheet = stripeModule.presentPaymentSheet;
    createPaymentMethod = stripeModule.createPaymentMethod;
  } catch (error) {
    console.warn('Stripe React Native not available:', error);
  }
}

export const stripeService = {
  async initialize(): Promise<void> {
    if (Platform.OS === 'web') {
      console.warn('Stripe is not supported on web platform');
      return;
    }

    if (!initStripe) {
      throw new Error('Stripe React Native is not available on this platform');
    }

    if (!stripeInitialized) {
      try {
        await initStripe({
          publishableKey: STRIPE_PUBLISHABLE_KEY,
          merchantIdentifier: 'merchant.com.restaurantapp',
        });
        stripeInitialized = true;
      } catch (error: any) {
        throw new Error(error.message || 'Failed to initialize Stripe');
      }
    }
  },

  async createPaymentIntent(amount: number, currency: string = 'zar'): Promise<string> {
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll simulate it
      // You would typically do: const response = await fetch('YOUR_BACKEND_URL/create-payment-intent', {...})
      
      // Demo response - replace with actual API call
      const mockPaymentIntent = {
        clientSecret: `pi_test_${Date.now()}`,
      };
      
      return mockPaymentIntent.clientSecret;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create payment intent');
    }
  },

  async processPayment(clientSecret: string): Promise<{ success: boolean; paymentIntentId?: string }> {
    if (Platform.OS === 'web') {
      // For web, simulate payment success (demo mode)
      console.warn('Stripe payment simulated on web platform');
      return {
        success: true,
        paymentIntentId: `pi_web_${Date.now()}`,
      };
    }

    if (!presentPaymentSheet) {
      throw new Error('Stripe React Native is not available on this platform');
    }

    try {
      await this.initialize();

      const { error, paymentIntent } = await presentPaymentSheet({
        clientSecret,
        merchantDisplayName: 'Bon Appetit Restaurant',
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        paymentIntentId: paymentIntent?.id,
      };
    } catch (error: any) {
      return {
        success: false,
      };
    }
  },

  async createPaymentMethod(cardDetails: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvc: string;
  }): Promise<string> {
    if (Platform.OS === 'web') {
      // For web, return mock payment method ID
      return `pm_web_${Date.now()}`;
    }

    if (!createPaymentMethod) {
      throw new Error('Stripe React Native is not available on this platform');
    }

    try {
      await this.initialize();

      const { error, paymentMethod } = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: cardDetails,
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentMethod?.id || '';
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create payment method');
    }
  },
};

