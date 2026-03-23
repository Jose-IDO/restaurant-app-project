/**
 * Stub Stripe service — @stripe/stripe-react-native removed to avoid EAS build failures
 * (Maven 503 / dependency resolution). Same API; payments are simulated.
 * Web uses stripeService.web.ts; native uses stripeService.native.ts.
 * To restore real Stripe: add @stripe/stripe-react-native back and use Expo Stripe plugin.
 */

export const stripeService = {
  async initialize(): Promise<void> {
    // no-op
  },

  async createPaymentIntent(_amount: number, _currency: string = 'zar'): Promise<string> {
    return `pi_stub_${Date.now()}`;
  },

  async processPayment(clientSecret: string): Promise<{ success: boolean; paymentIntentId?: string }> {
    return { success: true, paymentIntentId: clientSecret || `pi_stub_${Date.now()}` };
  },

  async createPaymentMethod(_cardDetails: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvc: string;
  }): Promise<string> {
    return `pm_stub_${Date.now()}`;
  },
};
