# iOS packaging notes

This Linux environment cannot run Xcode. On a Mac:

```bash
npm install
npm run build
npm install -D @capacitor/cli @capacitor/ios
npm install @capacitor/core @capacitor/haptics
npx cap add ios
npx cap sync ios
```

Then in the Xcode project:

1. Merge usage descriptions from `Info.plist.example` into `ios/App/App/Info.plist`.
2. Add `PrivacyInfo.xcprivacy` to the App target (required privacy manifest).
3. Set the 1024×1024 App Store icon (do not ship the web favicon as the only icon).
4. Set the deployment target to iOS 16+ and portrait iPhone first.
5. App Store Connect privacy nutrition: no tracking; data not collected by the developer (on-device only).
6. Age rating 12+; do **not** select Kids Category.
7. Support URL: your deployed `/support.html`. Privacy URL: `/privacy.html`.
