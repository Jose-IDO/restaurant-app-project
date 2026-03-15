# Set ANDROID_HOME and add platform-tools to PATH for Expo / React Native Android
# Run from project root: .\scripts\set-android-env.ps1
# Then close and reopen your terminal.

$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
if (-not (Test-Path $sdkPath)) {
    Write-Host "Android SDK not found at $sdkPath" -ForegroundColor Yellow
    Write-Host "Install Android Studio first (see ANDROID_SETUP.md), then run this script again." -ForegroundColor Yellow
    exit 1
}

$platformTools = "$sdkPath\platform-tools"
if (-not (Test-Path $platformTools)) {
    Write-Host "platform-tools not found. Open Android Studio > SDK Manager and install Android SDK Platform-Tools." -ForegroundColor Yellow
    exit 1
}

[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkPath, "User")
Write-Host "Set ANDROID_HOME = $sdkPath" -ForegroundColor Green

$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$platformTools*") {
    [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$platformTools", "User")
    Write-Host "Added platform-tools to PATH" -ForegroundColor Green
} else {
    Write-Host "platform-tools already in PATH" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Done. Close this terminal, open a new one, then run: npm start" -ForegroundColor Cyan
Write-Host "Press 'a' to open on Android emulator or device." -ForegroundColor Cyan
