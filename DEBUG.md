# Debugging the app when it crashes on phone (Android)

If the built app opens to a black screen and then closes on your phone, the crash is happening in the **native** layer or very early in the **JavaScript** layer. Use the steps below to get the actual error and fix it.

---

## 1. Get the crash log (required to know the cause)

### Option A: USB + ADB (recommended)

1. **Enable Developer options on your Android phone**
   - Settings → About phone → tap **Build number** 7 times.

2. **Enable USB debugging**
   - Settings → Developer options → **USB debugging** → On.

3. **Connect the phone to your PC with a USB cable.**

4. **Install ADB** (if needed)
   - [Android SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools) — extract and add the folder to your PATH, or
   - With Android Studio: `sdk/platform-tools/adb` is in the SDK folder.

5. **Check the device is seen**
   ```bash
   adb devices
   ```

6. **Clear old logs, then reproduce the crash**
   ```bash
   adb logcat -c
   ```
   Then open the app on the phone so it crashes.

7. **Capture the crash**
   ```bash
   adb logcat -d > crash.log
   ```
   Or filter for the most relevant tags:
   ```bash
   adb logcat -d "*:E" "ReactNative:V" "ReactNativeJS:V" "AndroidRuntime:E" > crash.log
   ```

8. **Open `crash.log`** and search for:
   - `FATAL`, `AndroidRuntime`, `Exception`, `Error`, `crash`, `ReactNativeJS`, `hermes`.

   The line(s) just before “Process ended” or “FATAL EXCEPTION” usually contain the real cause (e.g. missing native module, `NativeEventEmitter` null, `NoSuchMethodError`, etc.).

### Option B: EAS Build logs

If you install the app from an EAS build (Expo):

1. Go to [expo.dev](https://expo.dev) → your project → **Builds**.
2. Open the build that produced the APK/AAB you installed.
3. Check the build log for **errors** or **warnings** (e.g. missing config, wrong Stripe/Firebase setup). Build logs won’t show runtime crashes on the device; for those you need Option A or C.

### Option C: No USB — use device logs

On the phone:

- **Settings → Developer options → Bug report** (or **Take bug report**). After the crash, trigger a bug report and share the generated file. It includes logcat around the crash.

---

## 2. Why it works on web but not on the built app

| Area | Web | Built Android app |
|------|-----|--------------------|
| **Runtime** | Browser (JavaScript only) | Native Android process + JS (Hermes) |
| **Stripe** | Stub only (`stripeService.web.ts`) | Can load `@stripe/stripe-react-native` (native code) |
| **Firebase** | Same JS SDK | Same JS SDK, but env vars may be missing in EAS build |
| **New Architecture** | N/A | Can cause crashes with some native modules (e.g. Reanimated) |
| **Native modules** | None | Gesture handler, screens, Stripe, etc. run in native |

So the crash is usually one of:

1. **New Architecture + a native library** (e.g. Reanimated) → try `newArchEnabled: false` in `app.json`.
2. **Stripe native SDK** (init, `NativeEventEmitter`, or Compose) → we use a native stub (`stripeService.native.ts`) so the Stripe native module is never loaded from JS; if it still crashes, the native binary may still link Stripe — see “Stripe” below.
3. **Firebase** (e.g. missing env in EAS) → app can still open; you’ll see “App not configured” when logging in or placing orders. If the app crashes before any screen, the cause is likely not Firebase.
4. **Another native module** (e.g. gesture-handler, screens) → the crash log will name the module or stack.

---

## 3. Changes already made in this project to reduce crashes

- **`newArchEnabled: false`** in `app.json` — avoids known Reanimated/New-Arch crashes on Android.
- **`stripeService.native.ts`** — on Android/iOS we use a stub so the JS bundle never `require()`s `@stripe/stripe-react-native`. Payments are simulated on device until you switch back to the real Stripe implementation.
- **Firebase** — initialized only if config is present; services no-op or show “App not configured” if `auth`/`db` is null.
- **ErrorBoundary** in `App.tsx` — catches React render errors so you see “Something went wrong” instead of a blank crash (only for JS render errors, not native crashes).

---

## 4. If you still get a crash after the above

1. **Get the log** (Section 1) and find the exact exception or error line.
2. **Try a clean EAS build**
   ```bash
   npx eas build --platform android --profile preview --clear-cache
   ```
   Then install the new build and capture logcat again.
3. **Temporarily remove Stripe native** (to see if Stripe is the cause)
   - In `package.json` remove `"@stripe/stripe-react-native": "..."`.
   - Run `npm install`.
   - Ensure **only** the native stub is used (we use `stripeService.native.ts` on native, so no JS code should require Stripe). If the build still links Stripe, the EAS build will fail or the Stripe native code might still run; in that case, the crash log will tell you.
   - Rebuild: `npx eas build --platform android --profile preview` and test. If the crash stops, the cause was Stripe native; you can then add Stripe back with the correct Expo plugin and version.
4. **Search the error**  
   Copy the exact message (e.g. `NativeEventEmitter requires a non-null argument`, or `NoSuchMethodError` line) and search:
   - [Expo forums](https://forums.expo.dev/)
   - [React Native GitHub issues](https://github.com/facebook/react-native/issues)
   - [Stripe React Native issues](https://github.com/stripe/stripe-react-native/issues) (if the log mentions Stripe).

---

## 5. Quick reference: useful logcat filters

```bash
# All errors
adb logcat "*:E"

# React Native + JS
adb logcat "*:S" ReactNative:V ReactNativeJS:V

# Native crashes (Java/Kotlin)
adb logcat AndroidRuntime:E

# Clear then capture after reproducing crash
adb logcat -c && adb logcat | tee crash.log
```

After the app crashes, stop the last command (Ctrl+C) and open `crash.log` in a text editor to find the exception.
