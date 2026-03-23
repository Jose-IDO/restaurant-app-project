# Bon Appetit — Restaurant App

React Native (Expo) app: browse the menu, customize items, cart, checkout (ZAR), Firebase auth & orders, admin dashboard.  

---

## Requirements met (what the app does)

| Area | Met by |
|------|--------|
| **Menu & items** | Categories (Starters, Mains, Desserts, Drinks, Sides), item detail, images (Cloudinary when configured), prices in **ZAR**. |
| **Customization** | Sides (where defined), drink options, optional ingredients, extras, quantity. |
| **Cart** | Add/update/remove, **Edit** line items, delivery fee in total. |
| **Checkout** | Address & payment fields, **guests** can browse/cart; **sign-in required** to place order; **return to checkout** after login/sign-up with cart kept. |
| **Auth** | Register / login; session refreshes on use; **auto sign-out after 7 days** without opening the app. |
| **Payments** | Stripe test flow on web; **simulated** on native EAS builds (no real Stripe SDK in build). |
| **Admin** | Same login as customers; if user is admin in Firestore → dashboard: stats, **Food** CRUD, **Orders** (filters, stages, status updates), **Analytics** from real orders, **Restaurant settings** entry. |
| **Hosting** | Web can be deployed to **Firebase Hosting** (`npm run deploy-hosting`). Native via **EAS Build** (see [DEPLOY.md](DEPLOY.md)). |

---

## Install & run (developers)

**Prerequisites:** Node.js 18+, npm.

```bash
cd restaurant-app-project
npm install
```

**Environment:** Create `.env` with `EXPO_PUBLIC_FIREBASE_*` (6), `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`, `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. For **Android/iOS builds**, set the same variables in [Expo](https://expo.dev) → project → **Environment variables** (preview/production), then rebuild — otherwise login/orders show “App not configured”.

```bash
npm start          # Expo dev server
npm run web        # Web in browser
```

**Web (live site):** build + deploy with `npm run deploy-hosting` (needs Firebase CLI & project).  

**Phone (installable app):** use EAS, e.g. `npx eas build --platform android --profile preview`, then open the build URL on the device and install the APK. iOS: EAS with Apple credentials. Details: [DEPLOY.md](DEPLOY.md).

---

## How to use the app

### Install on your phone

1. Install the **APK** (or **AAB** from Play-style flow) from your **EAS build** page on [expo.dev](https://expo.dev), **or**  
2. Use **Expo Go** for development: `npm start`, scan the QR code (same network as PC).

### Guest (not logged in)

- Open app → **Menu** tab. Browse categories, open items, customize, **Add to Cart**.  
- **Cart** → **Proceed to Checkout**. To pay you must sign in → tap **Go to sign in** / **Sign in to place order** → after login or sign-up you land back on **Checkout** with the same cart.  
- **Profile** → **Login / Sign up** if you want to sign in earlier.

### Customer (logged in)

- **Profile:** your details, order history, logout.  
- **Checkout:** set address & payment, **Place Order** (test payment flow).

### Admin (testing)

- Use **Profile** → **Login / Sign up** (no separate admin button).  
- Log in with the account below. The user must have **`isAdmin: true`** in Firestore to see the admin dashboard.

**Admin credentials**

| Email | Password |
|-------|----------|
| `joeyidowu1996@gmail.com` | `Test1234` |

- After login: **Dashboard**, **Food**, **Orders**, **Analytics**; **Settings** from the dashboard.  
- Manage orders (including stages / status) under **Orders**.

---

## How to test (quick checklist)

1. **Guest path:** Menu → item → add to cart → checkout → confirm you’re asked to sign in → sign in → still on checkout with cart → place order (logged in).  
2. **Register:** Create account; optional fields can be left empty except required ones shown on the form.  
3. **Admin:** Log in with the admin table above → confirm dashboard loads → open Orders/Food/Analytics.  
4. **Web:** `npm run web`, repeat browse + checkout smoke test.  
5. **Native build:** After EAS install, confirm app opens (not black screen) and, if env vars are set on EAS, login and orders work.

For EAS builds, set the same `EXPO_PUBLIC_*` variables in [Expo](https://expo.dev) → your project → **Environment variables** for the build profile, then rebuild.
