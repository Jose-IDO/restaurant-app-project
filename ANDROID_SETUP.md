# Android SDK setup (for emulator / "Press a" in Expo)

Expo needs the **Android SDK** and **adb** so that "Press a" opens the app in an emulator or on a connected device. The errors you saw mean the SDK was not installed or not on your PATH.

**Quick path:** Install Android Studio (Option 1 or 2 below), then run `.\scripts\set-android-env.ps1` and restart your terminal.

---

## What was missing (from your terminal)

- **Android SDK path** not found: `C:\Users\steve\AppData\Local\Android\Sdk`
- **ANDROID_HOME** not set
- **adb** not recognized (comes from SDK `platform-tools`)

---

## Option 1: Install via winget (recommended)

In **PowerShell** or **Command Prompt** (Run as administrator if it fails):

```powershell
winget install -e --id Google.AndroidStudio --accept-package-agreements --accept-source-agreements
```

- Download is large (~1.3 GB). Wait for it to finish.
- When the **Android Studio installer** window opens, go through the steps (Next → Install). At the end it will install the **Android SDK** to `C:\Users\steve\AppData\Local\Android\Sdk` by default. Finish the wizard.
- If winget says "The process cannot access the file because it is being used", close other apps (browsers, other terminals), then run the same `winget install` command again. Or use Option 2 (manual download).

Then set environment variables (see **After installing** below).

---

## Option 2: Manual download

1. Go to [developer.android.com/studio](https://developer.android.com/studio).
2. Download **Android Studio** for Windows and run the installer.
3. During setup, leave **Android SDK** selected and note the SDK path (usually `C:\Users\steve\AppData\Local\Android\Sdk`).
4. Finish the wizard (you can skip creating a project).

Then set environment variables (see **After installing** below).

---

## After installing: set ANDROID_HOME and PATH

Expo and `adb` need these. Do **one** of the following.

### A. Using the script (easiest)

In the project folder, run:

```powershell
.\scripts\set-android-env.ps1
```

Then **close and reopen** your terminal (and restart Expo if it’s running).

### B. Manual (Windows)

1. Press **Win + R**, type `sysdm.cpl`, Enter.
2. **Advanced** tab → **Environment Variables**.
3. Under **User variables** → **New**:
   - Variable name: `ANDROID_HOME`
   - Value: `C:\Users\steve\AppData\Local\Android\Sdk`
4. Edit **Path** (User or System) → **New** → add:
   - `C:\Users\steve\AppData\Local\Android\Sdk\platform-tools`
   - `C:\Users\steve\AppData\Local\Android\Sdk\emulator` (optional, for emulator)
5. OK out. **Close all terminals** and open a new one.

---

## Verify

In a **new** terminal:

```powershell
echo $env:ANDROID_HOME
adb version
```

You should see the SDK path and the adb version. Then run `npm start` in your project and press **a** again; the Android emulator or device should start or be detected.
