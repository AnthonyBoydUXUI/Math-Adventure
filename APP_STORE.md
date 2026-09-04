# App Store submission notes

Math Adventure is Education software for seventh- and eighth-grade students (typically 12–14). Treat this file as the review checklist. Native iOS still has to be built on a Mac (`native/ios/README.md`).

## Category and age

- **Category:** Education
- **Age rating:** 12+
- **Kids Category:** do not select. The first-launch gate states the app is not for children under 13.
- Do not collect a birthdate.

Age-rating questionnaire (typical answers):

- No unrestricted web, no social network, no contests
- User-generated content: infrequent photos of the student’s own homework, stored only on device, never posted
- No violence, gambling, alcohol, or sexual content
- No medical treatment claims

## Privacy Nutrition Labels (App Store Connect)

- **Data used to track you:** none. No ATT prompt. No IDFA.
- **Data linked to the user:** optional Contact Info (email) and User Content (progress JSON) if they create an account. Used for app functionality (sync / backup). Not used to track.
- **Data not linked to the user:** on-device practice without an account.
- **Privacy Policy URL:** `https://<your-host>/privacy.html` (must load without the app)
- **Support URL:** `https://<your-host>/support.html`

In-app copies live at `/privacy`, `/terms`, `/support`, and Privacy Center at `/privacy-center`.

## Guidelines this build is written for

| Guideline | How Math Adventure meets it |
| --- | --- |
| 1.1.6 / 1.4.1 | Coaching is practice feedback, not a medical or official school diagnosis |
| 1.2 | No public UGC; photos never leave the device |
| 1.3 | Not Kids Category; 12+ gate |
| 1.5 | Working Support, Privacy, and Terms URLs in-app and as static HTML |
| 2.1 / 2.3 | Demo account is not required (no login). Review notes say to accept the gate as a parent |
| 4.2 | Offline bundled practice, camera/mic/haptics, not a thin website wrapper |
| 4.7 | No executable code download |
| 5.1.1 | Purpose strings + in-app preambles before camera/mic |
| 5.1.2 | No tracking, no analytics SDK, no Google Fonts network call |
| 5.2.1 | Original items; no publisher trademark or endorsement in the UI |
| Sign in with Apple | Not required — no accounts |
| IAP / 3.1 | No purchases |

## Review notes (paste into App Store Connect)

Math Adventure is a 15-minute math practice app. There is no account. On first launch, acknowledge the age/privacy gate as a parent or a student 12+. All practice items are original. Test Lab and readiness scores are practice feedback, not a medical or official school diagnosis. Camera and microphone are optional and explained before the system prompt; photos and speech stay on device. Export and delete are in System → Privacy Center.

## Still required on a Mac before submit

1. Capacitor iOS project + usage descriptions from `native/ios/Info.plist.example`
2. `PrivacyInfo.xcprivacy` in the app target
3. 1024×1024 App Store icon and 180×180 `apple-touch-icon`
4. Screenshots on current iPhone sizes
5. Hosted Privacy and Support URLs that match App Store Connect
