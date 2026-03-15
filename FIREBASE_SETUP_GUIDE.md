# Firebase Setup — Continue From Here

You've already set up Firebase, Cloudinary, `.env`, and run **`npm run migrate:firebase`**. Do the steps below in order.

---

## Where to continue

| # | Step | Done? | Continue here |
|---|------|-------|----------------|
| 1 | Firestore security rules pasted and published | ☐ | [Section 1: Security Rules](#1-security-rules) |
| 2 | One user set as admin in Firestore (`users` → doc → `isAdmin: true`) | ☐ | [Section 2: Create Admin User](#2-create-admin-user) |
| 3 | App runs and you can register, login, see menu | ☐ | [Section 3: Run the App](#3-run-the-app) |

---

## Table of Contents
1. [Security Rules](#1-security-rules)
2. [Create Admin User](#2-create-admin-user)
3. [Run the App](#3-run-the-app)
4. [Troubleshooting](#troubleshooting)

---

## 1. Security Rules

### Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users collection - users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Food items - public read, admin write
    match /foodItems/{itemId} {
      allow read: if true; // Anyone can read
      allow create, update, delete: if isAdmin();
    }
    
    // Orders - users can read/write their own, admins can read/write all
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Restaurant info - public read, admin write
    match /restaurantInfo/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

3. Click **"Publish"**

**Note:** We do not use Firebase Storage (it requires a credit card). Images are stored with **Cloudinary** (free). No Storage rules are needed.

---

## 2. Create Admin User

1. Register a user in the app.
2. In Firestore → `users` collection, open that user's document.
3. Set `isAdmin: true`, then save.
4. Log out and log back in to see the admin dashboard.

---

## 3. Run the App

**In the browser (for registering admin, etc.):**

```bash
npm run web
```

- When it's ready, Expo will open the app in your browser or show a URL in the terminal.
- The **web** app is usually at **http://localhost:19006** (not 8081 — that's the Metro bundler and may show a blank or different page).
- If you see "port in use", run: `npm run web:port` (uses port 8082), then open the URL Expo prints.

**Alternative (phone/simulator):** Run `npm start`, then press `w` for web, or scan the QR code for Expo Go.

Then: register/login, open Firestore to confirm data, and test orders and image uploads.

---

## Troubleshooting

| Issue | Fix |
|------|-----|
| "Firebase: Error (auth/invalid-api-key)" | Fix `.env` values and restart the app |
| "Missing or insufficient permissions" | Publish Firestore rules (Section 1) |
| "Cannot read property 'isAdmin' of undefined" | Ensure the user doc in `users` has `isAdmin` |
| Migration script fails | Check `.env` and that Firestore is in test mode (or rules allow writes) |
| App doesn't seem to use Firebase | Connection is in `src/config/firebase.ts`, `App.tsx`, and `src/services/*`. Ensure all 6 `EXPO_PUBLIC_FIREBASE_*` vars are set in `.env` and restart. |
