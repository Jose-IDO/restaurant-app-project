# Quick Start: Firebase Setup

**Continue from:** Check the first step below that you haven’t done yet, then do that step and the rest in order.

---

## 1. Create Firebase Project

1. [Firebase Console](https://console.firebase.google.com/) → **Add project** → name `restaurant-app` → Create (Spark plan, no credit card).
2. **Build** → **Authentication** → Get started → **Sign-in method** → Enable **Email/Password** → Save.
3. **Build** → **Firestore Database** → Create database → **test mode** → Choose location → Enable.
4. **Project Settings** → **Your apps** → Web icon → Register `restaurant-app-web` → Copy config values.

## 2. Set Up Cloudinary (images)

1. Sign up at [cloudinary.com](https://cloudinary.com) (no credit card).
2. Dashboard → copy **Cloud name**.
3. **Settings** → **Upload** → **Upload presets** → Add upload preset → Name: `restaurant_food_images`, **Signing Mode: Unsigned** → Save.

## 3. Environment Variables

Create `.env` in project root and add (replace with your values):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=restaurant_food_images
```

## 4. Run Migration

```bash
npm run migrate:firebase
```

## 5. Security Rules

**Firestore** → **Rules** → Paste rules from `FIREBASE_SETUP_GUIDE.md` (Section 5) → **Publish**.

## 6. Create Admin User

Register in the app → Firestore → `users` → open your user doc → set `isAdmin: true` → Save → log out and back in.

## 7. Run App

```bash
npm start
```

---

**Troubleshooting:** Missing env vars → check `.env`. Permission denied → Firestore rules. Invalid API key → match Firebase Console values.
