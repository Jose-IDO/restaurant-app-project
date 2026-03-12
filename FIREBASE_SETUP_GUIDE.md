# Firebase Setup & Database Migration Guide

This guide walks you through setting up **Firebase (Auth + Firestore)** for your restaurant app and migrating your static data. **Image storage uses Cloudinary** (free, no credit card) instead of Firebase Storage.

---

## Where to continue

Use this checklist. **Start from the first step that is not done yet.**

| # | Step | Done? | Continue here |
|---|------|-------|----------------|
| 1 | Firebase project created, Auth + Firestore enabled, config copied | ☐ | [Section 1: Firebase Project Setup](#1-firebase-project-setup) |
| 2 | Cloudinary account + unsigned upload preset `restaurant_food_images` | ☐ | [Section 2: Cloudinary](#2-free-image-storage-cloudinary) |
| 3 | `.env` file in project root with all 8 variables filled in | ☐ | [Section 3: Environment Variables](#3-environment-variables) |
| 4 | Migration run: `npm run migrate:firebase` | ☐ | [Section 4: Run Migration](#4-run-migration) |
| 5 | Firestore security rules pasted and published | ☐ | [Section 5: Security Rules](#5-security-rules) |
| 6 | One user set as admin in Firestore (`users` → doc → `isAdmin: true`) | ☐ | [Section 6: Create Admin User](#6-create-admin-user) |
| 7 | App runs: `npm start` and you can register, login, see menu | ☐ | [Section 7: Run the App](#7-run-the-app) |

**Example:** If you’ve already created the Firebase project and Cloudinary but not the `.env` file, continue at **Section 3**.

The app is already connected to Firebase (Auth + Firestore in `src/config/firebase.ts` and services). Once `.env` is filled and Firebase/Cloudinary are set up, it will work.

---

## Table of Contents
1. [Firebase Project Setup](#1-firebase-project-setup)
2. [Free Image Storage (Cloudinary)](#2-free-image-storage-cloudinary)
3. [Environment Variables](#3-environment-variables)
4. [Run Migration](#4-run-migration)
5. [Security Rules](#5-security-rules)
6. [Create Admin User](#6-create-admin-user)
7. [Run the App](#7-run-the-app)
8. [Troubleshooting](#troubleshooting)

---

## 1. Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `restaurant-app` (or your preferred name)
4. **Disable Google Analytics** (optional, for simplicity) or enable if you want it
5. Click **"Create project"**
6. Wait for project creation to complete, then click **"Continue"**

**💰 Important:** Use the **Spark plan (free tier)** — **no credit card required.** We use Firebase only for **Authentication** and **Firestore**. Image uploads use **Cloudinary** (free, no credit card). See `FIREBASE_PRICING_GUIDE.md` and `FREE_IMAGE_STORAGE.md`.

### Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Click on **"Sign-in method"** tab
4. Enable **"Email/Password"**:
   - Click on "Email/Password"
   - Toggle **"Enable"** to ON
   - Click **"Save"**
5. (Optional) Enable **"Google"** sign-in if you want Google authentication later

### Step 3: Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose a **location** closest to your users (e.g., `us-central1`, `europe-west1`)
5. Click **"Enable"**
6. Wait for database creation (takes ~1 minute)

### Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon next to "Project Overview")
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app (or use an existing web app)
4. Register app name: `restaurant-app-web` (if new). **DO NOT** check "Also set up Firebase Hosting"
5. Click **"Register app"**. Firebase will show a code snippet like this:

   ```javascript
   // Import the functions you need from the SDKs you need
   import { initializeApp } from "firebase/app";
   // TODO: Add SDKs for Firebase products that you want to use
   // https://firebase.google.com/docs/web/setup#available-libraries

   // Your web app's Firebase configuration
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.firebasestorage.app",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:xxxxxxxxxx"
   };

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   ```

6. Copy the **values** from `firebaseConfig` into your `.env` (Section 3). Map them like this:

   | firebaseConfig key   | .env variable |
   |----------------------|----------------|
   | `apiKey`             | `EXPO_PUBLIC_FIREBASE_API_KEY` |
   | `authDomain`         | `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` |
   | `projectId`          | `EXPO_PUBLIC_FIREBASE_PROJECT_ID` |
   | `storageBucket`      | `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` |
   | `messagingSenderId`  | `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
   | `appId`              | `EXPO_PUBLIC_FIREBASE_APP_ID` |

   **Note:** Newer projects may show `storageBucket` as `projectId.firebasestorage.app`; either that or `.appspot.com` is fine.

---

## 2. Free Image Storage (Cloudinary)

Firebase Storage requires a credit card (Blaze plan). We use **Cloudinary** instead — **free tier, no credit card.**

### Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up for Free"**
3. Sign up with Google, GitHub, or email — **no credit card required**
4. Verify your email if needed

### Step 2: Get Cloud Name and Create Upload Preset

1. Log in to [Cloudinary Console](https://console.cloudinary.com)
2. On the **Dashboard**, copy your **Cloud name**
3. Go to **Settings** (gear) → **Upload** tab
4. Scroll to **Upload presets** → **Add upload preset**
5. Name: `restaurant_food_images`
6. **Signing Mode:** Select **Unsigned**
7. Click **Save**

### Step 3: Add Cloudinary to your `.env` file

**Where:** The file named `.env` in your **project root** — i.e. `restaurant-app-project/.env` (same folder as `package.json`).

**How:**
1. Open `restaurant-app-project/.env` in your editor (create the file if it doesn’t exist).
2. Add these two lines (use your actual Cloud name from the Dashboard):

```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=restaurant_food_images
```

Replace `your-cloud-name` with your Cloudinary cloud name (e.g. `dsy5rp26e`). Keep the preset name as `restaurant_food_images` unless you used a different name in Step 2.

**Free tier includes:** 25 credits/month (storage, bandwidth, transformations). More than enough for 15–50 food images. See `FREE_IMAGE_STORAGE.md` for details.

---

## 3. Environment Variables

Add to `.env` in the project root (create the file if it doesn’t exist). Replace placeholders with your Firebase and Cloudinary values.

```env
# Firebase (Auth + Firestore)
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Cloudinary (free image storage)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=restaurant_food_images
```

---

## 4. Run Migration

From the project root:

```bash
npm run migrate:firebase
```

Or: `npx ts-node scripts/migrate-to-firebase.ts`

This creates the `foodItems` and `restaurantInfo` data in Firestore. Collections `users` and `orders` are created when users register and place orders.

---

## 5. Security Rules

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

## 6. Create Admin User

1. Register a user in the app.
2. In Firestore → `users` collection, open that user's document.
3. Set `isAdmin: true`, then save.
4. Log out and log back in to see the admin dashboard.

---

## 7. Run the App

**In the browser (for registering admin, etc.):**

```bash
npm run web
```

- When it’s ready, Expo will open the app in your browser or show a URL in the terminal.
- The **web** app is usually at **http://localhost:19006** (not 8081 — that’s the Metro bundler and may show a blank or different page).
- If you see “port in use”, run: `npm run web:port` (uses port 8082), then open the URL Expo prints.

**Alternative (phone/simulator):** Run `npm start`, then press `w` for web, or scan the QR code for Expo Go.

Then: register/login, open Firestore to confirm data, and test orders and image uploads.

---

## Troubleshooting

| Issue | Fix |
|------|-----|
| "Firebase: Error (auth/invalid-api-key)" | Fix `.env` values and restart the app |
| "Missing or insufficient permissions" | Publish Firestore rules (Section 5) |
| "Cannot read property 'isAdmin' of undefined" | Ensure the user doc in `users` has `isAdmin` |
| Migration script fails | Check `.env` and that Firestore is in test mode (or rules allow writes) |
| App doesn’t seem to use Firebase | Connection is in `src/config/firebase.ts`, `App.tsx`, and `src/services/*`. Ensure all 6 `EXPO_PUBLIC_FIREBASE_*` vars are set in `.env` and restart. |

