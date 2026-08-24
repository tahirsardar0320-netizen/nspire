# NSPIRE Inspection (Public) — Mobile App Wrapper

This is a Capacitor WebView wrapper around the live site (`https://nspireinspectionapp.com`).
It does **not** contain a copy of the website's code — `capacitor.config.ts` points the app
directly at the production URL, so every website deploy is reflected in the app immediately,
with no new store build required for content/UI changes.

This updates the **existing** store listings (not new ones):

- **Android / Play Store**: package `com.nspireapp` (currently listed as "Nspire")
- **iOS / App Store**: bundle ID `com.nspireapp.app` (currently listed as "NSPIRE Inspection", v2.7)

Both are being renamed to **"NSPIRE INSPECTION (Public)"** and pushed as a version update.

## What's done

- Capacitor project scaffolded (`android/`, `ios/` native projects generated)
- App name set to "NSPIRE INSPECTION (Public)" on both platforms
- App icon + splash screen generated from `public/logo.png` (blue background, matches site branding)
- Camera permission descriptions added (iOS `Info.plist`, Android `AndroidManifest.xml`) — needed
  since the app's "Take Photo" deficiency-photo feature uses the device camera
- iOS version bumped to 2.8 (build 1) — confirmed current live version is 2.7 via App Store lookup
- Android version left at the Capacitor default (1 / "1.0") — **needs the actual current live
  versionCode from Play Console before building**, since Play Store rejects an upload whose
  versionCode isn't strictly higher than what's currently live, and that number isn't publicly visible

## What's blocked / needed to actually build & submit

1. **Play Console + Apple Developer account access** (client is providing this)
2. **Existing Android signing key** — Play Store updates to an already-published app must be signed
   with the same upload key as the current build, or use Play App Signing if already enrolled.
   Client/whoever built the original app needs to provide the keystore (or confirm Play App Signing
   is active, in which case only the *upload* key matters).
3. **Android build environment** — no Android SDK is installed on this machine. Needed to actually
   compile a signed `.aab` for Play Store. Options: install Android SDK + Gradle locally, or build
   via a cloud CI (GitHub Actions, Codemagic, EAS, etc.)
4. **iOS build environment** — iOS apps can only be compiled with Xcode, which requires macOS. This
   machine is Linux, so iOS builds are not possible locally. Needed: either physical/remote Mac
   access, or a cloud Mac CI service (Codemagic, Bitrise, GitHub Actions macOS runner, etc.)
5. **Current live Android versionCode** (from Play Console) to set the next version correctly

## Once credentials + build environment are available

1. `npm install` in this folder
2. `npx cap sync`
3. Android: open `android/` in Android Studio (or CI), sign with the provided keystore, build `.aab`,
   upload via Play Console as an update to `com.nspireapp`
4. iOS: open `ios/App/App.xcworkspace` in Xcode (or CI), sign with the team's certificate/profile,
   archive, upload via Xcode Organizer or Transporter to App Store Connect as an update to
   `com.nspireapp.app`
