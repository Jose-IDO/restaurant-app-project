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
   - Firebase (Auth + Firestore) and Cloudinary: add credentials to `.env` (Firebase 6 vars, `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`, `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET`). Optional: Stripe `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` for payments.

3. **Run**
   ```bash
   npm start
   ```
   Web: `npm run web`. Deploy web: `npm run deploy-hosting` (see [DEPLOY.md](DEPLOY.md)).

## Admin login

| Email | Password |
|-------|----------|
| `joeyidou1996@gmail.com` | `Test123` |

Log in via **Login** or **Admin Login** from Profile to open the admin dashboard.

**Admin:** Dashboard, food CRUD, restaurant settings, order history, analytics (real Firestore data).

**User:** Register/login, profile (view & edit), browse menu by category, view item (sides, drink, extras, optional ingredients), cart (edit line options, quantity, remove), checkout (address, payment), order history.

## Branches

- **test_dev** — development
- **main** — main release
