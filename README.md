# Restaurant App (Bon Appetit)

React Native (Expo) app for browsing a food menu and placing orders. Uses Firebase (Auth + Firestore), Cloudinary for images, and Stripe for payments (ZAR, test mode).

## Tech stack

- **React Native** + **Expo** · **TypeScript** · **Redux Toolkit**
- **Firebase** — Auth, Firestore
- **Cloudinary** — Image storage
- **Stripe** — Payments (test)
- **React Navigation**

## Setup

**Prerequisites:** Node.js 18+, npm, Expo CLI, Firebase project.

1. **Install**
   ```bash
   npm install
   ```

2. **Configure**
   - Add a `.env` file with Firebase config (6 vars: `EXPO_PUBLIC_FIREBASE_*`), Cloudinary (`EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`, `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET`). Optional: `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` for payments.

3. **Run**
   ```bash
   npm start
   ```
   - **Web:** `npm run web` — app runs at the URL shown (e.g. http://localhost:8081).
   - **Deploy web:** `npm run deploy-hosting` (see [DEPLOY.md](DEPLOY.md)).

---

## How to use the app

### As a guest (not logged in)

- The app opens on the **Menu** tab. You can use the app without signing in.
- **Menu:** Browse food by category (Starters, Mains, Desserts, Drinks, Sides). Tap an item to open its details.
- **Item details:** See name, description, price, image. Choose sides (1 or 2 where offered), drink, optional ingredients, extras, quantity. Tap **Add to Cart**.
- **Cart:** View items, change quantity, remove items, or tap **Edit** on a line to change options. Tap **Proceed to Checkout**.
- **Checkout:** You see the order summary, delivery address, and payment. To **place the order** you must be logged in. If you are not, a **Sign in to place order** prompt and **Sign in** button appear; tap it to go to Login.
- **Profile:** Shows “Please Login” and a **Login / Sign up** button. Use it when you want to sign in or create an account.

### As a customer (logged in)

- **Profile** tab: **Login / Sign up** becomes your profile (name, email, phone, address). Tap the profile card to edit. **Order history** and **Logout** are available.
- **Checkout:** You can set or change delivery address and payment method, then tap **Place Order** to pay and complete the order (Stripe test mode, ZAR).
- You can still browse the menu and use the cart the same way as a guest.

### As an admin

- There is **no separate “Admin Login”** button. Log in with the **same Login** (Profile → **Login / Sign up**) using the admin account below.
- If that user has admin rights in Firestore (`isAdmin: true`), after login you see the **admin dashboard** instead of the normal menu.
- **Admin tabs:** Dashboard (overview, revenue), Food (add/edit/delete items), Orders (list and update status), Analytics (charts from Firestore). Restaurant settings are available from the dashboard.

**Admin credentials (for testing):**

| Email | Password |
|-------|----------|
| `joeyidou1996@gmail.com` | `Test123` |

---

## Branches

- **test_dev** — development
- **main** — main release
