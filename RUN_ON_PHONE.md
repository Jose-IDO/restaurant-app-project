# Run the app on your phone (no Android SDK needed)

Use **Expo Go** on your phone to open the app. Your computer runs the dev server; your phone loads the app over Wi‑Fi (or tunnel).

---

## Option A: Same Wi‑Fi (fastest)

1. **Install Expo Go** on your phone:
   - [Android: Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iPhone: App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Start the app** on your computer (in the project folder):
   ```bash
   npm start
   ```

3. **Connect your phone:**
   - **Android:** Open Expo Go → “Scan QR code” → scan the QR code in the terminal.
   - **iPhone:** Open the Camera app → point at the QR code → tap the banner to open in Expo Go.

4. **Same network:** Phone and computer must be on the **same Wi‑Fi**. If it fails with “Unable to connect”, use Option B (tunnel).

---

## Option B: Tunnel (works from any network)

Use this if Option A doesn’t connect (e.g. different Wi‑Fi, strict firewall, or company network).

1. **Install Expo Go** (see above).

2. **Start with tunnel** on your computer:
   ```bash
   npm run start:tunnel
   ```
   (Requires `@expo/ngrok` — it’s in the project. If the tunnel times out, use Option A with same Wi‑Fi.)

3. When it’s ready, a **new QR code** will appear. Scan it with Expo Go (Android) or Camera (iPhone) as in Option A.

4. The app will load over the tunnel; no need for phone and PC to be on the same Wi‑Fi.

---

## If you see “Android SDK not found”

That only affects **Android emulator** on your computer. To run on your **physical phone**, use Expo Go + QR code (Option A or B) — no SDK required.
