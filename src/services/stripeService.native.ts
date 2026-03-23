/**
 * Native (Android/iOS) stub for Stripe — avoids loading @stripe/stripe-react-native at startup
 * which can cause immediate crash (NativeEventEmitter, init, or Compose conflicts).
 * Same API as stripeService; payments are simulated so the app opens and checkout works.
 * To enable real Stripe on device later: remove this file and add Expo Stripe plugin + env vars.
 */

export const stripeService = {
  async initialize(): Promise<void> {
    // no-op
  },

  async createPaymentIntent(_amount: number, _currency: string = 'zar'): Promise<string> {
    return `pi_native_${Date.now()}`;
  },

  async processPayment(_clientSecret: string): Promise<{ success: boolean; paymentIntentId?: string }> {
    return { success: true, paymentIntentId: _clientSecret || `pi_native_${Date.now()}` };
  },

  async createPaymentMethod(_cardDetails: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvc: string;
  }): Promise<string> {
    return `pm_native_${Date.now()}`;
  },
};
