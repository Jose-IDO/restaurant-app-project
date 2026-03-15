# Stripe demo setup (South African app — ZAR)

The app uses **Stripe** for payments and is set up to use **ZAR (Rand)**. Right now Stripe is **not fully configured**: the publishable key is missing from `.env`, so you need a demo Stripe account and key.

---

## 1. Create a Stripe account (with your email)

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register).
2. Sign up with your **email** (and password). You can use a personal or work email.
3. Complete the sign-up. You do **not** need to activate live payments or add a bank account for testing.
4. After login, the Dashboard opens. Stay in **Test mode** (toggle in the sidebar or top: “Test mode” ON).

---

## 2. Get your test publishable key

1. In the Stripe Dashboard, go to **Developers** → **API keys**.
2. Under **Standard keys**, find **Publishable key** (starts with `pk_test_...`).
3. Click **Reveal** and copy the key (e.g. `pk_test_51ABC...`).

---

## 3. Add the key to the app

1. Open the **`.env`** file in the project root (`restaurant-app-project/.env`).
2. Add (replace with your real key):

```env
# Stripe (test mode — get from dashboard.stripe.com → Developers → API keys)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

3. Save the file and **restart** the dev server (`npm start` or `npm run web`).

---

## 4. Test cards (Stripe test mode)

No real money is charged. Use these in the app (e.g. at Checkout when you “select/change card” or in Stripe’s own test UI if you add card fields):

| Card number           | Use case   |
|-----------------------|------------|
| **4242 4242 4242 4242** | Success   |
| 4000 0000 0000 0002   | Declined   |
| 4000 0000 0000 3220   | 3D Secure |

- **Expiry:** any future date (e.g. 12/34).  
- **CVC:** any 3 digits (e.g. 123).  
- **ZIP:** any (e.g. 1234).

---

## 5. Current app behaviour

- **Web:** The app uses a **web stub** for Stripe (`stripeService.web.ts`): payments are simulated (no real Stripe SDK on web). You can still test the flow; no key needed for web-only.
- **Native (Expo / device):** The real Stripe SDK runs and needs `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env`. Without it, the app falls back to a placeholder and payment may fail on device.
- **Currency:** The app sends **ZAR** to Stripe where applicable (e.g. `createPaymentIntent(..., 'zar')`). All user-facing amounts are shown in **R** (Rand).

---

## Summary

| Step | Action |
|------|--------|
| 1 | Sign up at [dashboard.stripe.com/register](https://dashboard.stripe.com/register) with your email. |
| 2 | Developers → API keys → copy **Publishable key** (`pk_test_...`). |
| 3 | Add `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...` to `.env`. |
| 4 | Restart the app; use test card **4242 4242 4242 4242** for successful payments. |
