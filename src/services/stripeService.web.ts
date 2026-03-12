/**
 * Web stub for Stripe — native SDK is not supported on web.
 * Same API so CheckoutScreen works; payments are simulated for web (e.g. admin registration).
 */

export const stripeService = {
  async initialize(): Promise<void> {
    // no-op on web
  },

  async createPaymentIntent(_amount: number, _currency: string = 'zar'): Promise<string> {
    return `pi_web_${Date.now()}`;
  },

  async processPayment(_clientSecret: string): Promise<{ success: boolean; paymentIntentId?: string }> {
    return { success: true, paymentIntentId: `pi_web_${Date.now()}` };
  },

  async createPaymentMethod(_cardDetails: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvc: string;
  }): Promise<string> {
    return `pm_web_${Date.now()}`;
  },
};
