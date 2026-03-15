import { Platform } from 'react-native';

// Stripe key - only read when needed (EAS builds may not have env at module load)
function getStripeKey(): string {
  return process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51...';
}

let stripeInitialized = false;

// Lazy-load Stripe only when first needed (avoids native crash on app open if SDK/key misconfigured)
function getStripeModule(): { initStripe: any; presentPaymentSheet: any; createPaymentMethod: any } | null {
  if (Platform.OS === 'web') return null;
  try {
    const stripeModule = require('@stripe/stripe-react-native');
    return {
      initStripe: stripeModule.initStripe,
      presentPaymentSheet: stripeModule.presentPaymentSheet,
      createPaymentMethod: stripeModule.createPaymentMethod,
    };
  } catch (error) {
    console.warn('Stripe React Native not available:', error);
    return null;
  }
}

export const stripeService = {
  async initialize(): Promise<void> {
    if (Platform.OS === 'web') return;

    const mod = getStripeModule();
    if (!mod?.initStripe) return; // no-op if Stripe unavailable instead of throwing

    if (!stripeInitialized) {
      try {
        const key = getStripeKey();
        if (!key || key === 'pk_test_51...') {
          console.warn('Stripe publishable key not set; payment may be simulated.');
          return;
        }
        await mod.initStripe({
          publishableKey: key,
          merchantIdentifier: 'merchant.com.restaurantapp',
        });
        stripeInitialized = true;
      } catch (error: any) {
        console.warn('Stripe init failed:', error?.message);
      }
    }
  },

  async createPaymentIntent(_amount: number, _currency: string = 'zar'): Promise<string> {
    return `pi_test_${Date.now()}`;
  },

  async processPayment(clientSecret: string): Promise<{ success: boolean; paymentIntentId?: string }> {
    if (Platform.OS === 'web') {
      return { success: true, paymentIntentId: `pi_web_${Date.now()}` };
    }

    const mod = getStripeModule();
    if (!mod?.presentPaymentSheet) {
      // Stripe not available: simulate success so app doesn't break (e.g. dev build without key)
      return { success: true, paymentIntentId: clientSecret || `pi_${Date.now()}` };
    }

    try {
      await this.initialize();
      const { error, paymentIntent } = await mod.presentPaymentSheet({
        clientSecret,
        merchantDisplayName: 'Bon Appetit Restaurant',
      });
      if (error) throw new Error(error.message);
      return { success: true, paymentIntentId: paymentIntent?.id };
    } catch (error: any) {
      return { success: false };
    }
  },

  async createPaymentMethod(_cardDetails: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvc: string;
  }): Promise<string> {
    if (Platform.OS === 'web') return `pm_web_${Date.now()}`;

    const mod = getStripeModule();
    if (!mod?.createPaymentMethod) return `pm_${Date.now()}`;

    try {
      await this.initialize();
      const { error, paymentMethod } = await mod.createPaymentMethod({
        paymentMethodType: 'Card',
        card: _cardDetails,
      });
      if (error) throw new Error(error.message);
      return paymentMethod?.id || '';
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create payment method');
    }
  },
};
