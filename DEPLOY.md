# Deploy & Publish

## Live web app (Firebase Hosting)

The app is hosted on Firebase. After any code change, rebuild and deploy:

```bash
npm run deploy-hosting
```

**Live URL:** https://restaurant-app-79942.web.app

(Also: https://restaurant-app-79942.firebaseapp.com)

---

## Downloadable app (Expo EAS Build)

To build an **APK** (Android) or **IPA** (iOS) so you or testers can install the app on a device:

### 1. Install EAS CLI and log in

```bash
npm install -g eas-cli
eas login
```

Use your Expo account (create one at [expo.dev](https://expo.dev) if needed).

### 2. Configure the project (first time only)

If you haven’t run EAS for this project before:

```bash
eas build:configure
```

This uses the existing `eas.json` in the repo.

### 3. Build for Android (APK – no Play Store)

```bash
eas build --platform android --profile preview
```

- **preview** profile builds an **APK** you can download and install directly.
- When the build finishes, EAS shows a link to download the APK.

### 4. Build for iOS (TestFlight / internal)

```bash
eas build --platform ios --profile preview
```

Requires an Apple Developer account and proper signing. For internal testing you can use the same `preview` profile with “internal” distribution.

### 5. Production builds (stores)

- **Android:** `eas build --platform android --profile production` → AAB for Play Store.
- **iOS:** `eas build --platform ios --profile production` → IPA for App Store / TestFlight.

---

## Summary

| Goal              | Command / Link |
|-------------------|----------------|
| Live web app      | https://restaurant-app-79942.web.app |
| Redeploy web      | `npm run deploy-hosting` |
| Android APK       | `eas build --platform android --profile preview` then download from EAS |
| iOS build         | `eas build --platform ios --profile preview` (Apple account required) |
